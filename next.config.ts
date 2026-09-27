import type { NextConfig } from "next";

// 純靜態輸出：所有計算都在瀏覽器執行，不需要伺服器；
// 同一份輸出可直接部署到 Vercel，也可日後以 Capacitor 包成 iOS／Android 原生 App。
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BUILD_ID: String(Date.now()) },
};

export default nextConfig;
