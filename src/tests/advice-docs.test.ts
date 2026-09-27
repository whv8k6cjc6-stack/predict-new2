/** 人工審閱文件與程式同步：docs/LIFE_FACTOR_MAPPING.md、docs/ADVICE_TEMPLATES.md。
 *  更新：ADVICE_DOCS_WRITE=1 npx vitest run src/tests/advice-docs.test.ts */
import { it, expect } from "vitest";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { BAZI_RULES } from "@/kb/rules/bazi";
import { QIMEN_RULES, QIMEN_EVENT_RULES } from "@/kb/rules/qimen";
import { ICHING_RULES } from "@/kb/rules/iching";
import { adviceTemplatesDoc, lifeFactorMappingDoc } from "@/core/advice/docs";

const docs: [string, string][] = [
  ["docs/LIFE_FACTOR_MAPPING.md", lifeFactorMappingDoc([...BAZI_RULES, ...QIMEN_RULES, ...QIMEN_EVENT_RULES, ...ICHING_RULES])],
  ["docs/ADVICE_TEMPLATES.md", adviceTemplatesDoc()],
];

it("對照表與建議清單文件是最新的", () => {
  for (const [rel, content] of docs) {
    const file = path.resolve(__dirname, "../..", rel);
    if (process.env.ADVICE_DOCS_WRITE) writeFileSync(file, content);
    expect(existsSync(file), `${rel} 不存在，請以 ADVICE_DOCS_WRITE=1 產生`).toBe(true);
    expect(readFileSync(file, "utf8"), `${rel} 過期，請以 ADVICE_DOCS_WRITE=1 重新產生`).toBe(content);
  }
});
