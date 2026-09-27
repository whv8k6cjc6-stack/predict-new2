"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useApp } from "../providers";
import { RELATIONS, relationLabel, type Relation } from "@/core/person";
import { reorderPersons, setFavorite } from "@/data/repo";
import { Button, Chip, EmptyState, Icon, PageHeader } from "@/ui/primitives";
import { Avatar } from "@/ui/Nav";

type Sort = "custom" | "recent" | "name" | "birth";
const SORTS: { k: Sort; l: string }[] = [{ k: "custom", l: "自訂" }, { k: "recent", l: "最近使用" }, { k: "name", l: "姓名" }, { k: "birth", l: "出生日" }];

export default function PersonsPage() {
  const { persons, tags, refresh, active } = useApp();
  const [q, setQ] = useState("");
  const [rel, setRel] = useState<Relation | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [favOnly, setFavOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("custom");
  const [ordering, setOrdering] = useState(false);

  const list = useMemo(() => {
    const kw = q.trim();
    const f = persons.filter(b =>
      (!kw || [b.person.displayName, b.person.fullName, b.person.relationNote, b.person.note].some(x => x?.includes(kw))) &&
      (!rel || b.person.relation === rel) && (!tag || b.tagIds.includes(tag)) && (!favOnly || b.person.isFavorite));
    const s = [...f];
    if (sort === "recent") s.sort((a, b) => (b.person.lastViewedAt ?? "").localeCompare(a.person.lastViewedAt ?? ""));
    else if (sort === "name") s.sort((a, b) => a.person.displayName.localeCompare(b.person.displayName, "zh-Hant"));
    else if (sort === "birth") s.sort((a, b) => a.birth.localDate.localeCompare(b.birth.localDate));
    else s.sort((a, b) => a.person.sortOrder - b.person.sortOrder);
    return s;
  }, [persons, q, rel, tag, favOnly, sort]);

  const move = async (idx: number, dir: -1 | 1) => {
    const ids = persons.slice().sort((a, b) => a.person.sortOrder - b.person.sortOrder).map(b => b.person.id);
    const id = list[idx].person.id, j = ids.indexOf(id), k = j + dir;
    if (k < 0 || k >= ids.length) return;
    [ids[j], ids[k]] = [ids[k], ids[j]];
    await reorderPersons(ids); await refresh();
  };

  const filtered = q || rel || tag || favOnly;

  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <PageHeader title="人物" subtitle={`共 ${persons.length} 位・資料只存在這台裝置`}
        right={<Link href="/persons/edit/"><Button variant="primary" size="sm"><Icon name="plus" size={16} />新增</Button></Link>} />

      {persons.length === 0 ? (
        <EmptyState title="還沒有任何人物" action={<Link href="/persons/edit/"><Button variant="primary">建立第一位人物</Button></Link>}>
          可以建立自己、家人、朋友、同事、主管、客戶的命理檔案。
        </EmptyState>
      ) : (
        <>
          <div className="relative">
            <Icon name="search" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]" />
            <input className="input pl-10" placeholder="搜尋姓名、暱稱、關係、備註" value={q} onChange={e => setQ(e.target.value)} aria-label="搜尋人物" />
          </div>
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
            <Chip active={favOnly} onClick={() => setFavOnly(!favOnly)}>★ 最愛</Chip>
            {RELATIONS.map(r => <Chip key={r.key} active={rel === r.key} onClick={() => setRel(rel === r.key ? null : r.key)}>{r.label}</Chip>)}
          </div>
          {tags.length > 0 && (
            <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4">
              {tags.map(t => <Chip key={t.id} active={tag === t.id} onClick={() => setTag(tag === t.id ? null : t.id)}># {t.name}</Chip>)}
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1 text-[12px]">
              {SORTS.map(s => (
                <button key={s.k} onClick={() => { setSort(s.k); setOrdering(false); }}
                  className={`rounded-full px-2.5 py-1 ${sort === s.k ? "bg-[var(--surface-2)] text-[var(--ink-1)]" : "text-[var(--ink-3)]"}`}>{s.l}</button>
              ))}
            </div>
            {sort === "custom" && !filtered && (
              <button onClick={() => setOrdering(!ordering)} className="text-[12px] text-[var(--accent)]">{ordering ? "完成" : "調整順序"}</button>
            )}
          </div>

          <ul className="card mt-2 divide-y divide-[var(--line)]">
            {list.map((b, i) => (
              <li key={b.person.id} className="flex items-center gap-3 px-4 py-3">
                <Link href={`/persons/view/?id=${b.person.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar name={b.person.displayName} size={40} />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[15px]">{b.person.displayName}</span>
                      {b.person.id === active?.person.id && <span className="rounded bg-[var(--accent)]/15 px-1.5 text-[10px] text-[var(--accent)]">分析中</span>}
                    </span>
                    <span className="block truncate text-[12px] text-[var(--ink-3)]">
                      {b.person.relationNote || relationLabel(b.person.relation)}・<span className="num">{b.birth.localDate.replaceAll("-", "/")}</span>{b.birth.localTime ? ` ${b.birth.localTime}` : ""}
                      {b.tagIds.length > 0 && `・${b.tagIds.map(id => tags.find(t => t.id === id)?.name).filter(Boolean).join("、")}`}
                    </span>
                  </span>
                </Link>
                {ordering ? (
                  <span className="flex gap-1">
                    <button aria-label="上移" onClick={() => move(i, -1)} className="rounded-lg bg-[var(--surface-2)] p-2"><Icon name="up" size={16} /></button>
                    <button aria-label="下移" onClick={() => move(i, 1)} className="rounded-lg bg-[var(--surface-2)] p-2"><Icon name="down" size={16} /></button>
                  </span>
                ) : (
                  <button aria-label={b.person.isFavorite ? "取消最愛" : "加入最愛"} aria-pressed={b.person.isFavorite}
                    onClick={async () => { await setFavorite(b.person.id, !b.person.isFavorite); await refresh(); }}
                    className={b.person.isFavorite ? "text-[var(--accent)]" : "text-[var(--ink-3)]"}>
                    <Icon name="star" size={20} filled={b.person.isFavorite} />
                  </button>
                )}
              </li>
            ))}
            {!list.length && <li className="px-4 py-8 text-center text-[14px] text-[var(--ink-3)]">沒有符合條件的人物</li>}
          </ul>
        </>
      )}
    </main>
  );
}
