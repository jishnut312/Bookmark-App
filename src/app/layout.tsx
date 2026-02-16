import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Bookmark App - Save & Organize Your Links",
  description: "A simple and elegant bookmark manager with Google OAuth authentication, real-time updates, and private bookmark storage.",
  keywords: ["bookmarks", "bookmark manager", "save links", "organize links", "Google OAuth"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
