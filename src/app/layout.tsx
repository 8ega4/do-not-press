import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { OG_IMAGE_PATH } from "@/lib/og";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const ogImageUrl = `${siteUrl}${OG_IMAGE_PATH}`;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetUrl = (path: string) => `${basePath}${path}`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "絶対に押すな", template: "%s｜絶対に押すな" },
  description: "メリットと変な代償を読み、赤いボタンを押すか決める10秒間の二択ゲーム。",
  applicationName: "絶対に押すな",
  icons: {
    icon: [
      { url: assetUrl("/favicon.ico") },
      { url: assetUrl("/icon-16x16.png"), sizes: "16x16", type: "image/png" },
      { url: assetUrl("/icon-32x32.png"), sizes: "32x32", type: "image/png" },
      { url: assetUrl("/icon-48x48.png"), sizes: "48x48", type: "image/png" },
    ],
    shortcut: [{ url: assetUrl("/favicon.ico") }],
    apple: [{ url: assetUrl("/apple-touch-icon.png"), sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "絶対に押すな",
    description: "その代償、本当に払えますか？",
    type: "website",
    locale: "ja_JP",
    siteName: "絶対に押すな",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "絶対に押すな" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "絶対に押すな",
    description: "その代償、本当に払えますか？",
    images: [ogImageUrl],
  },
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
