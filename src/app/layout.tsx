import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "絶対に押すな", template: "%s｜絶対に押すな" },
  description: "メリットと変な代償を読み、赤いボタンを押すか決める5秒間の二択ゲーム。",
  applicationName: "絶対に押すな",
  openGraph: {
    title: "絶対に押すな",
    description: "その代償、本当に払えますか？",
    type: "website",
    locale: "ja_JP",
    siteName: "絶対に押すな",
  },
  twitter: { card: "summary_large_image", title: "絶対に押すな", description: "その代償、本当に払えますか？" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#c9151e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
