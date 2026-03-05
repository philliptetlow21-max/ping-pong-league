import { NextRequest, NextResponse } from "next/server";
import { createViewerCookie, COOKIE_NAME } from "@/lib/viewer-auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const expectedUsername = process.env.VIEWER_USERNAME;
    const expectedPassword = process.env.VIEWER_PASSWORD;

    if (!expectedUsername || !expectedPassword) {
      return NextResponse.json({ error: "Viewer auth not configured" }, { status: 500 });
    }

    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const cookieValue = createViewerCookie();
    const response = NextResponse.json({ ok: true });

    response.cookies.set(COOKIE_NAME, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
