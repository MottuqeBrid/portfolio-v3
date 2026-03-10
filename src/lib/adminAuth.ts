import crypto from "crypto";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_DAYS = 7;

function getSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string, secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
}

export function createAdminToken(email: string) {
  const secret = getSecret();

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  const payload = {
    email,
    role: "admin",
    exp: Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  };

  const payloadRaw = JSON.stringify(payload);
  const payloadB64 = toBase64Url(payloadRaw);
  const signature = sign(payloadB64, secret);

  return `${payloadB64}.${signature}`;
}

export function verifyAdminToken(token: string | undefined | null) {
  if (!token) {
    return { valid: false, reason: "missing" } as const;
  }

  const secret = getSecret();
  if (!secret) {
    return { valid: false, reason: "missing-secret" } as const;
  }

  const [payloadB64, providedSig] = token.split(".");

  if (!payloadB64 || !providedSig) {
    return { valid: false, reason: "malformed" } as const;
  }

  const expectedSig = sign(payloadB64, secret);

  if (providedSig.length !== expectedSig.length) {
    return { valid: false, reason: "signature" } as const;
  }

  const safeEqual = crypto.timingSafeEqual(
    Buffer.from(providedSig),
    Buffer.from(expectedSig),
  );

  if (!safeEqual) {
    return { valid: false, reason: "signature" } as const;
  }

  try {
    const payload = JSON.parse(fromBase64Url(payloadB64)) as {
      email: string;
      role: string;
      exp: number;
    };

    if (payload.role !== "admin") {
      return { valid: false, reason: "role" } as const;
    }

    if (payload.exp < Date.now()) {
      return { valid: false, reason: "expired" } as const;
    }

    return { valid: true, email: payload.email } as const;
  } catch {
    return { valid: false, reason: "parse" } as const;
  }
}

export function getAuthCookieConfig() {
  return {
    name: SESSION_COOKIE_NAME,
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  };
}

export function isAdminCredentialValid(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  if (!adminEmail || !adminPassword) {
    return { valid: false, reason: "missing-config" } as const;
  }

  return {
    valid: email === adminEmail && password === adminPassword,
    reason: "invalid",
  } as const;
}
