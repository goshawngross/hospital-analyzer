import { NextRequest, NextResponse } from "next/server";

const VALID_USERNAME = "agentvitals";
const VALID_PASSWORD = "12345";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      const response = NextResponse.json({ success: true });

      // Set a simple auth cookie — httpOnly so JS can't read it, 7-day expiry
      response.cookies.set("av_auth", "authenticated", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
