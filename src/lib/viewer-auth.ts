import { cookies } from "next/headers";
import { createHmac } from "crypto";

const COOKIE_NAME = "viewer-auth";

function sign(value: string): string {
  const secret = process.env.NEXTAUTH_SECRET!;
  const sig = createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${sig}`;
}

function verify(signed: string): string | null {
  const secret = process.env.NEXTAUTH_SECRET!;
  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return null;
  const value = signed.slice(0, lastDot);
  const sig = signed.slice(lastDot + 1);
  const expected = createHmac("sha256", secret).update(value).digest("hex");
  if (sig !== expected) return null;
  return value;
}

export function createViewerCookie(): string {
  return sign("viewer");
}

export async function isViewerAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return false;
  return verify(cookie.value) === "viewer";
}

export { COOKIE_NAME };
