import { NextRequest, NextResponse } from "next/server";
import { createViewerCookie, COOKIE_NAME } from "@/lib/viewer-auth";
import bcrypt from "bcryptjs";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  try {
    const { username, password } = await request.json();

    const expectedUsername = process.env.VIEWER_USERNAME;
    const passwordHash = process.env.VIEWER_PASSWORD_HASH;

    if (!expectedUsername || !passwordHash) {
      return NextResponse.json(
        { error: "Viewer auth not configured" },
        { status: 500 }
      );
    }

    if (
      username !== expectedUsername ||
      !(await bcrypt.compare(password, passwordHash))
    ) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const cookieValue = createViewerCookie();
    const response = NextResponse.json({ ok: true });

    response.cookies.set(COOKIE_NAME, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err) {
    console.error("Viewer login error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
