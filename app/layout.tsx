import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hospital Website Agentic Readiness Analyzer",
  description:
    "Evaluate how ready your hospital website is for AI agents. Get a free scorecard with grades and actionable recommendations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
