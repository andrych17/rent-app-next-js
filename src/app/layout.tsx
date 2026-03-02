import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "monis.rent — Design Your Dream Workspace",
  description:
    "Build your perfect office setup in Bali. Pick a desk, choose a chair, add accessories — see it come to life, then rent it all.",
  openGraph: {
    title: "monis.rent — Workspace Designer",
    description: "Design and rent your dream workspace in Bali",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
