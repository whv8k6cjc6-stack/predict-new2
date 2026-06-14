"use client";
import type { Notes } from "@/ai/chart-notes";

export function NotesPanel({ notes, disclaimer }: { notes: Notes; disclaimer?: string }) {
  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--panel)] p-4">
        <p className="text-sm text-[var(--gold)]">白話重點</p>
        <ul className="mt-2 space-y-2 text-sm leading-relaxed">
          {notes.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      </div>
      {notes.glossary.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-[var(--panel)] p-4">
          <p className="text-sm">名詞速查</p>
          <dl className="mt-2 space-y-2 text-sm leading-relaxed">
            {notes.glossary.map((g, i) => (
              <div key={i}>
                <dt className="inline text-[var(--jade)]">{g.term}：</dt>
                <dd className="inline text-[var(--ink-dim)]">{g.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <p className="text-[11px] leading-relaxed text-[var(--ink-dim)]">
        {disclaimer ?? "以上為通行命理釋義，僅供個人參考，非絕對吉凶；命理結果與實際際遇無必然因果。"}
      </p>
    </div>
  );
}
