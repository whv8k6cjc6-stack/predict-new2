"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useApp } from "@/app/providers";
import { relationLabel } from "@/core/person";
import { Icon, Sheet } from "./primitives";

const ITEMS = [
  { href: "/", label: "今日", icon: "sun" },
  { href: "/event/", label: "擇時", icon: "clock" },
  { href: "/persons/", label: "人物", icon: "people" },
  { href: "/glossary/", label: "辭典", icon: "book" },
  { href: "/settings/", label: "設定", icon: "gear" },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav aria-label="主要導覽" className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-xl">
      <ul className="mx-auto flex max-w-lg justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1">
        {ITEMS.map(it => {
          const on = it.href === "/" ? path === "/" : path.startsWith(it.href.replace(/\/$/, ""));
          return (
            <li key={it.href} className="flex-1">
              <Link href={it.href} aria-current={on ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${on ? "text-[var(--ink-1)]" : "text-[var(--ink-3)]"}`}>
                <Icon name={it.icon} size={22} />{it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <span className="font-serif flex shrink-0 items-center justify-center rounded-full bg-[var(--surface-3)] text-[var(--ink-1)]"
      style={{ width: size, height: size, fontSize: size * 0.42 }}>{name.slice(0, 1)}</span>
  );
}

/** 首頁上方人物快速切換：最愛、最近使用置頂，可搜尋 */
export function PersonSwitcher() {
  const { active, persons, setActive } = useApp();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const list = useMemo(() => {
    const f = persons.filter(b => !q || b.person.displayName.includes(q) || (b.person.fullName ?? "").includes(q) || (b.person.relationNote ?? "").includes(q));
    return f.sort((a, b) =>
      Number(b.person.isFavorite) - Number(a.person.isFavorite) ||
      (b.person.lastViewedAt ?? "").localeCompare(a.person.lastViewedAt ?? "") ||
      a.person.sortOrder - b.person.sortOrder);
  }, [persons, q]);

  if (!active) return null;
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2.5 rounded-full border border-[var(--line-strong)] bg-[var(--surface-1)] py-1 pl-1 pr-3" aria-label={`目前分析人物：${active.person.displayName}，點擊切換`}>
        <Avatar name={active.person.displayName} size={30} />
        <span className="max-w-[9rem] truncate text-[14px]">{active.person.displayName}</span>
        <Icon name="down" size={16} className="text-[var(--ink-3)]" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="切換分析人物">
        {persons.length > 6 && (
          <input className="input mb-3" placeholder="搜尋姓名、暱稱、關係" value={q} onChange={e => setQ(e.target.value)} />
        )}
        <ul className="divide-y divide-[var(--line)]">
          {list.map(b => (
            <li key={b.person.id}>
              <button onClick={async () => { await setActive(b.person.id); setOpen(false); }} className="flex w-full items-center gap-3 py-3 text-left">
                <Avatar name={b.person.displayName} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px]">{b.person.displayName}</span>
                  <span className="text-[12px] text-[var(--ink-3)]">{b.person.relationNote || relationLabel(b.person.relation)}・{b.birth.localDate.replaceAll("-", "/")}</span>
                </span>
                {b.person.isFavorite && <Icon name="star" size={14} filled className="text-[var(--accent)]" />}
                {b.person.id === active.person.id && <span className="text-[12px] text-[var(--accent)]">目前</span>}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => { setOpen(false); router.push("/persons/edit/"); }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--line-strong)] py-3 text-[14px] text-[var(--ink-2)]">
          <Icon name="plus" size={16} /> 新增人物
        </button>
      </Sheet>
    </>
  );
}
