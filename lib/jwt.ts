// lib/jwt.ts
import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

export async function signSession(payload: object, maxAgeSeconds = 60 * 60 * 8) {
  const secret = process.env.SESSION_SECRET!;
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSeconds}s`)
    .sign(encoder.encode(secret));
}

export async function verifySession(token: string) {
  const secret = process.env.SESSION_SECRET!;
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    return payload;
  } catch {
    return null;
  }
}
