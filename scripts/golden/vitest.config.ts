import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  css: { postcss: { plugins: [] } },
  resolve: { alias: { "@": path.resolve(__dirname, "../../src") } },
  test: { environment: "node", include: ["scripts/golden/*.test.ts"], testTimeout: 600_000 },
});
