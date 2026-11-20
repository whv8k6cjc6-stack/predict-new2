"""Polite, whitelisted HTTP client: throttle, exponential backoff, on-disk cache.

Fetched bytes are only ever returned as data; nothing here executes or evals content.
"""
from __future__ import annotations

import hashlib
import json
import logging
import os
import random
import time
from pathlib import Path
from urllib.parse import urlencode, urljoin, urlparse

from . import settings as S

log = logging.getLogger("fetch")


class FetchError(Exception):
    pass


class Fetcher:
    def __init__(self, cache_dir: Path | str | None = None, session=None, sleep=time.sleep,
                 clock=time.monotonic, min_interval: dict | None = None):
        self.cache_dir = Path(cache_dir) if cache_dir else S.CACHE_DIR
        if session is None:
            import requests
            session = requests.Session()
        self.session = session
        self.sleep = sleep
        self.clock = clock
        self.intervals = dict(S.MIN_INTERVAL if min_interval is None else min_interval)
        self._last: dict[str, float] = {}
        self.n_requests = 0
        self.n_cache_hits = 0

    # ---- safety -------------------------------------------------------
    @staticmethod
    def check_url(url: str) -> str:
        p = urlparse(url)
        if p.scheme != "https" or p.hostname not in S.ALLOWED_HOSTS:
            raise FetchError(f"blocked (not whitelisted https host): {p.scheme}://{p.hostname}")
        return url

    # ---- cache --------------------------------------------------------
    def _key(self, method, url, params, data) -> str:
        raw = json.dumps([method, url, sorted((params or {}).items()), sorted((data or {}).items())],
                         ensure_ascii=False, default=str)
        return hashlib.sha1(raw.encode()).hexdigest()

    def _cpath(self, key: str) -> Path:
        return self.cache_dir / key[:2] / f"{key}.bin"

    def _cache_read(self, key, ttl):
        p = self._cpath(key)
        try:
            if p.exists() and (ttl is None or time.time() - p.stat().st_mtime < ttl):
                return p.read_bytes()
        except OSError:
            pass
        return None

    def _cache_write(self, key, body: bytes):
        p = self._cpath(key)
        try:
            p.parent.mkdir(parents=True, exist_ok=True)
            tmp = p.with_suffix(".tmp")
            tmp.write_bytes(body)
            os.replace(tmp, p)
        except OSError as e:  # cache is best-effort
            log.warning("cache write failed: %s", e)

    # ---- throttle -----------------------------------------------------
    def _throttle(self, host):
        gap = max(1.0, self.intervals.get(host, S.DEFAULT_MIN_INTERVAL))
        last = self._last.get(host)
        if last is not None:
            wait = gap - (self.clock() - last)
            if wait > 0:
                self.sleep(wait)
        self._last[host] = self.clock()

    # ---- main ---------------------------------------------------------
    def get(self, url, *, params=None, data=None, method=None, validator=None, ttl=None,
            use_cache=True, max_retries=None, backoff_base=None) -> bytes:
        """Return response bytes. `validator(bytes)->bool` False => treated as transient (WAF page etc.).
        ttl=None caches forever. Raises FetchError after retries are exhausted."""
        self.check_url(url)
        method = method or ("POST" if data is not None else "GET")
        key = self._key(method, url, params, data)
        if use_cache:
            hit = self._cache_read(key, ttl)
            if hit is not None:
                self.n_cache_hits += 1
                return hit
        retries = S.MAX_RETRIES if max_retries is None else max_retries
        base = S.BACKOFF_BASE if backoff_base is None else backoff_base
        last_err = "unknown"
        for attempt in range(retries + 1):
            if attempt:
                delay = min(S.BACKOFF_CAP, base * 2 ** (attempt - 1)) + random.uniform(0, 0.5)
                log.info("backoff %.1fs (%s) %s", delay, last_err, url)
                self.sleep(delay)
            try:
                status, body, retry_after = self._once(method, url, params, data)
            except FetchError:
                raise
            except Exception as e:  # network error
                last_err = f"network: {type(e).__name__}"
                continue
            if status == 429 or status >= 500:
                last_err = f"http {status}"
                if retry_after:
                    self.sleep(min(S.BACKOFF_CAP, retry_after))
                continue
            if status in (301, 302, 303, 307, 308) or status >= 400:
                # permanent-ish (error page redirect, 404, 403): retry only if validator-less 307 WAF
                last_err = f"http {status}"
                if status == 307:
                    continue
                raise FetchError(f"{last_err} for {url}")
            if validator is not None and not validator(body):
                last_err = "invalid/blocked content"
                continue
            if use_cache:
                self._cache_write(key, body)
            return body
        raise FetchError(f"gave up after {retries + 1} tries ({last_err}): {url}")

    def _once(self, method, url, params, data):
        host = urlparse(url).hostname
        for _hop in range(4):
            self._throttle(host)
            self.n_requests += 1
            r = self.session.request(
                method, url, params=params if _hop == 0 else None,
                data=data if _hop == 0 else None,
                headers={"User-Agent": S.USER_AGENT, "Accept": "*/*"},
                timeout=S.TIMEOUT, allow_redirects=False, stream=True)
            status = r.status_code
            if status in (301, 302, 303, 307, 308):
                loc = r.headers.get("Location", "")
                if not loc:  # e.g. TWSE WAF page answers 307 with no Location
                    body = r.content[: 64 * 1024]
                    r.close()
                    return status, body, None
                tgt = urljoin(url, loc)
                low = tgt.lower()
                if tgt.startswith("http://"):
                    tgt = "https://" + tgt[len("http://"):]
                try:
                    self.check_url(tgt)
                except FetchError:
                    r.close()
                    return 302, b"", None
                if any(x in low for x in ("/errors", "/404", "error")):
                    r.close()
                    return 404, b"", None
                r.close()
                url, host, method = tgt, urlparse(tgt).hostname, "GET"
                continue
            chunks, n = [], 0
            for ch in r.iter_content(65536):
                n += len(ch)
                if n > S.MAX_BYTES:
                    r.close()
                    raise FetchError("response too large")
                chunks.append(ch)
            ra = None
            try:
                ra = float(r.headers.get("Retry-After", ""))
            except ValueError:
                pass
            return status, b"".join(chunks), ra
        return 302, b"", None


def json_validator(body: bytes) -> bool:
    try:
        json.loads(body.decode("utf-8"))
        return True
    except Exception:
        return False


def build_url(url, params) -> str:
    return f"{url}?{urlencode(params)}" if params else url
