import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Lab — Corporate Enthusiasts",
  description: "Idea evaluation board for Corporate Enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${manrope.variable} min-h-screen bg-[var(--bg)] font-[family-name:var(--font-manrope)] text-[var(--text-primary)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
