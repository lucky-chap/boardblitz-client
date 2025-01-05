import "./globals.css";

import type { ReactNode } from "react";
import ContextProvider from "@/context/ContextProvider";

import AuthModal from "@/components/auth/AuthModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "chessu",
  description: "Play Chess online.",
  openGraph: {
    title: "chessu",
    description: "Play Chess online.",
    url: "https://boardblitz.vercel.app",
    siteName: "chessu",
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
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <ContextProvider>
          <Header />

          <main className="mx-1 flex min-h-[70vh] justify-center md:mx-16 lg:mx-40">
            {children}
          </main>

          <AuthModal />
        </ContextProvider>

        <Footer />
      </body>
    </html>
  );
}

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }
