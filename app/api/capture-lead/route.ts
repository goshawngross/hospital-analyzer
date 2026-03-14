import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const WEB3FORMS_KEY = "8a27b57d-65d6-4e09-a95c-a23c40d9ab72";

interface LeadCapture {
  email: string;
  url: string;
  overallGrade: string;
  overallScore: number;
  timestamp: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadCapture = await req.json();

    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required." },
        { status: 400 }
      );
    }

    // Send email notification via Web3Forms
    const emailRes = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `New Lead: ${body.email} — llms.txt request`,
        from_name: "AgentVitals",
        message: [
          `New llms.txt file request from AgentVitals.`,
          ``,
          `Email: ${body.email}`,
          `Website analyzed: ${body.url}`,
          `Overall grade: ${body.overallGrade} (${body.overallScore}/100)`,
          `Submitted: ${body.timestamp}`,
          ``,
          `This person wants a custom llms.txt file created for their hospital website.`,
        ].join("\n"),
      }),
    });

    if (!emailRes.ok) {
      console.error("Web3Forms error:", await emailRes.text());
    }

    // Also log to Vercel function logs as backup
    console.log("=== NEW LEAD ===", JSON.stringify({
      email: body.email,
      url: body.url,
      grade: body.overallGrade,
      score: body.overallScore,
    }));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}
