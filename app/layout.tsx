import "./globals.css";

import type { ReactNode } from "react";
import localFont from "next/font/local";
import ContextProvider from "@/context/ContextProvider";

const inter = localFont({
  variable: "--font-sans",
  src: [
    {
      path: "../public/fonts/inter/Inter-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/inter/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/inter/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/inter/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/inter/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/inter/Inter-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
});

const spaceMono = localFont({
  variable: "--font-mono",
  src: [
    {
      path: "../public/fonts/space-mono/SpaceMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/space-mono/SpaceMono-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/space-mono/SpaceMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/space-mono/SpaceMono-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
});

export const metadata = {
  title: "Boardblitz",
  description: "Play Chess online.",
  openGraph: {
    title: "Boardblitz",
    description: "Play Chess online.",
    url: "https://boardblitz.vercel.app",
    siteName: "Boardblitz",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: false,
    nocache: true,
    noarchive: true,
  },
  icons: {
    icon: [
      { type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
      { type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  metadataBase: new URL(
    process.env.VERCEL
      ? "https://boardblitz.vercel.app"
      : "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceMono.variable} overflow-x-hidden font-sans`}
      >
        <ContextProvider>
          <main className="flex min-h-svh">{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}
