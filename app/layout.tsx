import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Token Bound Account Iframe | Showcase Your TBA Seamlessly",
  description:
    "Effortlessly display and showcase your Token Bound Account (TBA)",
  openGraph: {
    title: "Token Bound Account Iframe | Showcase Your TBA Seamlessly",
    description:
      "Effortlessly display and showcase your Token Bound Account (TBA)",
    url: "https://iframe.tbaexplorer.com/",
  },
  twitter: {
    card: "summary",
    title: "Token Bound Account Iframe | Showcase Your TBA Seamlessly",
    description:
      "Effortlessly display and showcase your Token Bound Account (TBA)",
  },
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
