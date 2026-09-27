import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "./providers";
import { BottomNav } from "@/ui/Nav";

export const metadata: Metadata = {
  title: "玄機決策",
  description: "專業東方命理排盤與決策輔助（完全離線、資料只存在本機）",
  manifest: "/manifest.json",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "玄機決策" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#111012",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-dvh">
        <AppProvider>
          <div className="safe-bottom">{children}</div>
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
