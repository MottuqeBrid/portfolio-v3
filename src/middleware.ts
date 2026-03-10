import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "admin_session";
const LOGIN_PATH = "/login";

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = `${base64}${padding}`;
  return atob(normalized);
}

function arrayBufferToBase64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function verifyAdminToken(token?: string) {
  if (!token) {
    return false;
  }

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
  if (!secret) {
    return false;
  }

  const [payloadB64, providedSig] = token.split(".");
  if (!payloadB64 || !providedSig) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );

  const expectedSig = arrayBufferToBase64Url(signature);
  if (providedSig !== expectedSig) {
    return false;
  }

  try {
    const payloadJson = decodeBase64Url(payloadB64);
    const payload = JSON.parse(payloadJson) as {
      role: string;
      exp: number;
    };

    return payload.role === "admin" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = await verifyAdminToken(token);

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL(LOGIN_PATH, req.url);
  loginUrl.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
