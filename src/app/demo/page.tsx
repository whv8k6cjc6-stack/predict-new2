"use client";
import { DOMAINS } from "@/core/domains";
import type { DomainScore } from "@/core/score";
import { Banner, SectionTitle } from "@/ui/primitives";
import { BandLegend, ConfidenceDots, DomainRow, ScoreRing } from "@/ui/score";
import { EvidenceChain, FourLayerCard, ModeToggle, Term } from "@/ui/interpret";

/** DEMO 版面：所有數字與文字皆為固定的假資料，未經任何命理計算，只用來檢視介面。 */
const DEMO_VALUES: Record<string, number> = { overall: 72, career: 81, wealth: 86, investment: 58, social: 74, love: 63, travel: 90, health: 47, decision: 35 };

export default function DemoPage() {
  const demo = (k: string): DomainScore => ({ status: "demo", domain: k as DomainScore["domain"], value: DEMO_VALUES[k], confidence: 3, note: "DEMO 測試資料" });
  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <div className="sticky top-0 z-30 -mx-4 bg-[var(--bg)] px-4 pb-3 pt-2">
        <Banner tone="demo" title="DEMO 測試資料・非任何人的運勢">
          本頁所有分數、文字與依據都是寫死的範例，只用來檢視介面設計，未經任何命理計算。
        </Banner>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-[22px] font-semibold">版面範例</h1>
        <ModeToggle />
      </div>

      <section className="card demo-stripe mt-4 flex items-center gap-5 p-5">
        <ScoreRing value={DEMO_VALUES.overall} demo caption="DEMO 綜合指數" />
        <div>
          <p className="text-[13px] text-[var(--ink-3)]">今日綜合指數（DEMO）</p>
          <p className="mt-2"><ConfidenceDots level={3} /></p>
          <p className="mt-2 text-[12px] text-[var(--ink-3)]">星等看分數高低；圓點看各系統意見是否一致。</p>
        </div>
      </section>

      <SectionTitle>九大領域（DEMO）</SectionTitle>
      <div className="card demo-stripe divide-y divide-[var(--line)] px-4">
        {DOMAINS.map(d => <DomainRow key={d.key} s={demo(d.key)} />)}
      </div>
      <p className="mt-2 px-1 text-[12px] leading-relaxed text-[var(--ink-3)]">範例中「財運 86」與「投資 58」分開計分：可能有收款或財務好消息，但不代表適合進行市場操作。</p>

      <SectionTitle>四層解讀（DEMO）</SectionTitle>
      <FourLayerCard title="今日投資（DEMO）" badge={<span className="rounded bg-[var(--demo)]/20 px-1.5 text-[11px] text-[var(--demo)]">DEMO</span>}
        layer={{
          conclusion: "【範例文字】可以觀察，但不適合因盤中情緒突然擴大部位。",
          plain: "【範例文字】今天不是完全不能投資，而是判斷力容易受到短期波動影響。",
          pro: "【範例文字】正式版此處會列出：流日干支與本命的作用、紫微財帛／福德宮四化、奇門生門落宮，以及各自對應的規則編號。",
          actions: ["【範例】既有策略照原本規則執行", "【範例】臨時出現的新標的不建議追價"],
        }} />

      <SectionTitle>交叉判讀（DEMO）</SectionTitle>
      <div className="card demo-stripe p-4 text-[14px]">
        <ul className="space-y-1.5">
          {[["八字", "偏正面"], ["紫微", "偏正面"], ["奇門", "偏負面"], ["易經", "中性"]].map(([s, v]) => (
            <li key={s} className="flex justify-between"><span>{s}</span>
              <span style={{ color: v === "偏正面" ? "var(--sig-pos)" : v === "偏負面" ? "var(--sig-neg)" : "var(--sig-neu)" }}>{v}</span></li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--ink-2)]">【範例】訊號分歧：長期命勢沒有問題，但此刻時機不佳 → 事情可以做，建議改時間。</p>
      </div>

      <SectionTitle>證據鏈（DEMO）</SectionTitle>
      <EvidenceChain items={[
        { system: "八字", ruleId: "demo.bazi.example", factors: ["【範例】流日天干對日主為某十神", "【範例】該五行屬喜用"], weight: "【範例】流日尺度 × 八字權重", contribution: 4, commentary: "【範例】注解層顯示於此" },
        { system: "奇門", ruleId: "demo.qimen.example", factors: ["【範例】某時辰生門落某宮", "【範例】逢空亡"], weight: "【範例】時辰尺度 × 奇門權重", contribution: -2 },
      ]} />

      <SectionTitle>可點術語</SectionTitle>
      <p className="card p-4 text-[14px] leading-loose">
        點看看：<Term term="偏財" />、<Term term="七殺" />、<Term term="化忌" />、<Term term="生門" />、<Term term="伏吟" />。
        面板會分成「專業定義／白話／在我命盤代表什麼／今天為什麼出現」四部分；後兩部分在排盤引擎完成後才會依個人命盤顯示。
      </p>

      <SectionTitle>分數區間定義（正式制度）</SectionTitle>
      <BandLegend />
    </main>
  );
}
