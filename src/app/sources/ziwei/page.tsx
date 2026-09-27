"use client";
import { BackButton } from "@/ui/PageBack";
import { ZiweiSourcesDetail } from "@/ui/ZiweiInterpretation";

/** 紫微來源與判讀規則詳情：來源層級、匯入狀態、覆蓋矩陣、規則閘門、引用與衝突。 */
export default function ZiweiSourcesPage() {
  return (
    <main className="safe-top mx-auto max-w-lg px-4">
      <BackButton />
      <h1 className="font-serif mt-4 text-[24px] font-semibold">紫微來源與規則</h1>
      <p className="mt-1 mb-4 text-[12px] leading-relaxed text-[var(--ink-3)]">古籍 → 引用 → 判讀規則 → 生活因素 → 建議。原文、白話翻譯、App 判讀與建議分開存放；沒有足夠來源的判讀暫不判。iztro 只作排盤相容性比對，不作判讀依據。</p>
      <ZiweiSourcesDetail />
    </main>
  );
}
