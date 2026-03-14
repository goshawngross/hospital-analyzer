import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentVitals — The AI Readiness Check for Hospital Websites",
  description:
    "Is your hospital website ready for AI agents? AgentVitals evaluates how well AI can understand, navigate, and book appointments on your site. Free scorecard with grades and recommendations.",
  openGraph: {
    title: "AgentVitals — The AI Readiness Check for Hospital Websites",
    description:
      "Is your hospital website ready for AI agents? Get a free scorecard evaluating how well AI can understand, navigate, and book appointments on your site.",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
    type: "website",
    url: "https://hospital-analyzer.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentVitals — The AI Readiness Check for Hospital Websites",
    description:
      "Is your hospital website ready for AI agents? Get a free scorecard with grades and recommendations.",
    images: ["/api/og"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
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
