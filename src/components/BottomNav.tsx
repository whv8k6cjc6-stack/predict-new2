"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "今日", icon: "M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z" },
  { href: "/query", label: "查詢", icon: "M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" },
  { href: "/profile", label: "命盤", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6", match: ["/profile", "/bazi", "/ziwei", "/qimen"] },
  { href: "/quant", label: "量化", icon: "M4 19V9M10 19V5M16 19v-7M22 19H2" },
  { href: "/glossary", label: "辭典", icon: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM4 19a2 2 0 012-2h13" },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-[var(--bg)]/85 backdrop-blur-xl" aria-label="主要導覽">
      <ul className="mx-auto flex max-w-md justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1.5">
        {ITEMS.map(it => {
          const on = it.href === "/" ? path === "/" : (it.match ?? [it.href]).some(m => path.startsWith(m));
          return (
            <li key={it.href} className="flex-1">
              <Link href={it.href} aria-current={on ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-1.5 text-[11px] ${on ? "text-[var(--gold)]" : "text-[var(--ink-dim)]"}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={it.icon} />
                </svg>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
