/** 規則引擎：以 Facts 比對 RuleDefinition，產生 RuleMatch 與渲染後的四層文字。
 *  規則沒命中就不產生任何文字；模板槽位缺值時丟棄該規則並記錄警告（不輸出殘句）。 */
import type { Fact } from "../engine";
import type { Condition, RuleDefinition, RuleMatch } from "../sources";

export type FactIndex = Map<string, Fact>;
export const indexFacts = (facts: Fact[]): FactIndex => new Map(facts.map(f => [f.key, f]));

function leaf(c: Extract<Condition, { fact: string }>, idx: FactIndex, used: Fact[]): boolean {
  const f = idx.get(c.fact);
  const v = f?.value;
  let ok: boolean;
  switch (c.op) {
    case "exists": ok = f !== undefined && v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0) && v !== false; break;
    case "eq": ok = v === c.value; break;
    case "neq": ok = f !== undefined && v !== c.value; break;
    case "in": ok = Array.isArray(c.value) && (c.value as unknown[]).includes(v); break;
    case "notIn": ok = f !== undefined && Array.isArray(c.value) && !(c.value as unknown[]).includes(v); break;
    case "gte": ok = typeof v === "number" && v >= (c.value as number); break;
    case "lte": ok = typeof v === "number" && v <= (c.value as number); break;
    case "contains": ok = Array.isArray(v) && (v as unknown[]).includes(c.value); break;
    default: ok = false;
  }
  if (ok && f) used.push(f);
  return ok;
}

export function evalCondition(c: Condition, idx: FactIndex, used: Fact[] = []): boolean {
  if ("fact" in c) return leaf(c, idx, used);
  if ("all" in c) { const u: Fact[] = []; const ok = c.all.every(x => evalCondition(x, idx, u)); if (ok) used.push(...u); return ok; }
  if ("any" in c) { for (const x of c.any) { const u: Fact[] = []; if (evalCondition(x, idx, u)) { used.push(...u); return true; } } return false; }
  if ("not" in c) return !evalCondition(c.not, idx, []);
  return false;
}

const fmt = (v: unknown): string => Array.isArray(v) ? v.join("、") : v === null || v === undefined ? "" : String(v);

export class TemplateError extends Error {}

export function renderTemplate(tpl: string, slots: Record<string, string>, idx: FactIndex, extra: Record<string, string> = {}): string {
  return tpl.replace(/\{([^{}]+)\}/g, (_, name: string) => {
    if (name in extra) return extra[name];
    const key = slots[name];
    if (!key) throw new TemplateError(`模板槽位「${name}」未對應事實`);
    const f = idx.get(key);
    const s = fmt(f?.value);
    if (!s) throw new TemplateError(`模板槽位「${name}」（${key}）無值`);
    return s;
  });
}

export interface FiredRule {
  rule: RuleDefinition;
  match: RuleMatch;
  text: { conclusion: string; plain: string; pro: string; legacyAdviceText: string[] };
  /** 靜態 based_on.text_ids 加上依盤面決定的原文 id */
  textIds: string[];
}

export function runRules(rules: RuleDefinition[], facts: Fact[], globalSlots: Record<string, string> = {}): { fired: FiredRule[]; warnings: string[] } {
  const idx = indexFacts(facts);
  const warnings: string[] = [];
  const fired: FiredRule[] = [];
  for (const rule of rules) {
    if (!rule.enabled) continue;
    const used: Fact[] = [];
    if (!evalCondition(rule.condition, idx, used)) continue;
    const slots = { ...globalSlots, ...rule.slots };
    try {
      const text = {
        conclusion: renderTemplate(rule.templates.conclusion, slots, idx),
        plain: renderTemplate(rule.templates.plain, slots, idx),
        pro: renderTemplate(rule.templates.pro, slots, idx),
        legacyAdviceText: rule.templates.legacyAdviceText.map(a => renderTemplate(a, slots, idx)),
      };
      const uniq = [...new Map(used.map(u => [u.key, u])).values()];
      const dyn = (rule.dynamic_text_slots ?? []).map(k => idx.get(k)?.value).filter((v): v is string => typeof v === "string");
      fired.push({ rule, match: { rule_id: rule.id, matched: uniq.map(u => ({ fact: u.key, value: u.value, derivation: u.derivation })) }, text, textIds: [...rule.based_on.text_ids, ...dyn] });
    } catch (e) {
      warnings.push(`${rule.id}: ${(e as Error).message}`);
    }
  }
  // 互斥：被較高優先的已觸發規則排除者移除
  const firedIds = new Set(fired.map(f => f.rule.id));
  const excluded = new Set<string>();
  for (const f of [...fired].sort((a, b) => (b.rule.priority ?? 50) - (a.rule.priority ?? 50))) {
    if (excluded.has(f.rule.id)) continue;
    for (const x of f.rule.excludes ?? []) if (firedIds.has(x)) excluded.add(x);
  }
  return { fired: fired.filter(f => !excluded.has(f.rule.id)), warnings };
}

// ───────── 反空泛 lint（CI 測試強制） ─────────
export const BANNED_PHRASES = ["保持正向", "努力就會成功", "近期要注意小人", "今天可能有貴人", "一定", "必定", "保證", "絕對", "買進", "賣出", "%", "％", "機率"];

export function lintRule(r: RuleDefinition): string[] {
  const errs: string[] = [];
  const hasSlot = (t: string) => /\{[^{}]+\}/.test(t);
  if (!hasSlot(r.templates.conclusion)) errs.push("conclusion 缺少命盤槽位");
  if (!hasSlot(r.templates.plain)) errs.push("plain 缺少命盤槽位");
  if (!hasSlot(r.templates.pro)) errs.push("pro 缺少命盤槽位");
  if (!r.templates.legacyAdviceText.length) errs.push("缺少舊版建議文字（legacyAdviceText，僅供專業模式參考）");
  const all = [r.templates.conclusion, r.templates.plain, r.templates.pro, ...r.templates.legacyAdviceText].join("");
  for (const b of BANNED_PHRASES) if (all.includes(b)) errs.push(`含禁用語「${b}」`);
  if ((all.includes("貴人") || all.includes("小人")) && !r.terms.some(t => ["天乙貴人", "值符", "玄武", "白虎", "螣蛇", "化科", "六合", "太陰"].includes(t)))
    errs.push("「貴人／小人」只能用於綁定神煞或八神的規則");
  if (!r.based_on.principle) errs.push("缺少命理原則說明");
  if (!r.effects.length) errs.push("缺少影響領域");
  return errs;
}
