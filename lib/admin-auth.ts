import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24시간

function getSecret() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD를 .env.local에 설정해 주세요.");
  }
  return secret;
}

export function createAdminToken() {
  const payload = JSON.stringify({
    user: process.env.ADMIN_USERNAME || "admin",
    exp: Date.now() + COOKIE_MAX_AGE * 1000,
  });
  const signature = createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return Buffer.from(payload).toString("base64url") + "." + signature;
}

export function verifyAdminToken(token: string): boolean {
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return false;
    const payloadStr = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadStr);
    if (payload.exp < Date.now()) return false;
    const expected = createHmac("sha256", getSecret())
      .update(payloadStr)
      .digest("hex");
    return timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return !!token && verifyAdminToken(token);
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
