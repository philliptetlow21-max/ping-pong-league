import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page, API routes, static files, and NextAuth routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  // Check for NextAuth session
  const token = await getToken({ req: request });
  if (token) {
    return NextResponse.next();
  }

  // Check for viewer cookie (signed with HMAC)
  const viewerCookie = request.cookies.get("viewer-auth");
  if (viewerCookie) {
    const signed = viewerCookie.value;
    const lastDot = signed.lastIndexOf(".");
    if (lastDot !== -1) {
      const value = signed.slice(0, lastDot);
      const sig = signed.slice(lastDot + 1);

      const secret = process.env.NEXTAUTH_SECRET!;
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const sigBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
      const expected = Array.from(new Uint8Array(sigBytes))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (sig === expected && value === "viewer") {
        return NextResponse.next();
      }
    }
  }

  // Redirect to login
  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
