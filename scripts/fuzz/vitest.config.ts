import { defineConfig } from "vitest/config";
import path from "node:path";
/** Fuzz Test：真正隨機，只用來發現新問題；不屬於回歸測試（回歸測試一律使用固定 fixture）。 */
export default defineConfig({
  css: { postcss: { plugins: [] } },
  resolve: { alias: { "@": path.resolve(__dirname, "../../src") } },
  test: { environment: "node", include: ["scripts/fuzz/*.test.ts"], testTimeout: 600_000 },
});
