import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "玄機決策",
  description: "個人每日運勢：八字・滴天髓・紫微・奇門・易經合參",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "玄機決策" },
};

export const viewport: Viewport = {
  themeColor: "#0e0b16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-dvh">
        <div className="pb-safe">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
