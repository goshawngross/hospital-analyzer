import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

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

    // Log the lead for now — visible in Vercel function logs
    // In production, connect to a database, email service, or CRM
    console.log("=== NEW LEAD CAPTURED ===");
    console.log(JSON.stringify({
      email: body.email,
      url: body.url,
      overallGrade: body.overallGrade,
      overallScore: body.overallScore,
      timestamp: body.timestamp,
      capturedAt: new Date().toISOString(),
    }, null, 2));
    console.log("=========================");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}
