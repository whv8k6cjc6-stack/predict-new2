import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSystemPrompt, buildUserPrompt, FORBIDDEN_WORDS, STANDARD_DISCLAIMER, INVESTMENT_DISCLAIMER } from "@/ai/prompt-builder";

const OutSchema = z.object({
  summary: z.string(), careerAdvice: z.string().default(""), wealthAdvice: z.string().default(""),
  relationshipAdvice: z.string().default(""), healthAdvice: z.string().default(""), peopleAdvice: z.string().default(""),
  suitableActions: z.array(z.string()).default([]), avoidActions: z.array(z.string()).default([]),
  bestDirection: z.string().default(""), bestTimeRange: z.string().default(""),
  riskWarning: z.string().default(""), practicalStrategy: z.string().default(""),
  confidenceLevel: z.enum(["low","medium","high"]).default("medium"),
  disclaimer: z.string().default(""),
});

function scrub(s: string): string {
  let out = s;
  for (const w of FORBIDDEN_WORDS) out = out.replaceAll(w, w === "買進" || w === "賣出" ? "調整" : "傾向");
  return out;
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "未設定 ANTHROPIC_API_KEY（Vercel 環境變數），目前請使用本機模板解釋。" }, { status: 501 });
  let body: { fortuneResult?: unknown; topic?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  if (!body.fortuneResult) return NextResponse.json({ error: "missing fortuneResult" }, { status: 400 });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "claude-sonnet-4-6",
        max_tokens: 1000,
        system: buildSystemPrompt(),
        messages: [{ role: "user", content: buildUserPrompt(body.fortuneResult as never) }],
      }),
    });
    if (!res.ok) return NextResponse.json({ error: `AI 服務回應 ${res.status}` }, { status: 502 });
    const data = await res.json();
    const text: string = (data.content ?? []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = OutSchema.parse(JSON.parse(clean));
    // 程式層防線：禁用詞過濾 + 強制覆寫免責聲明
    (Object.keys(parsed) as (keyof typeof parsed)[]).forEach(k => {
      if (typeof parsed[k] === "string") (parsed as Record<string, unknown>)[k] = scrub(parsed[k] as string);
    });
    parsed.suitableActions = parsed.suitableActions.map(scrub);
    parsed.avoidActions = parsed.avoidActions.map(scrub);
    parsed.disclaimer = body.topic === "wealth" ? INVESTMENT_DISCLAIMER : STANDARD_DISCLAIMER;
    if (body.topic === "wealth" && !parsed.wealthAdvice.includes("紀律"))
      parsed.wealthAdvice += " 實際進出請依自身停損停利與部位紀律執行。";
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "AI 輸出驗證失敗，請改用本機模板解釋。" }, { status: 502 });
  }
}
