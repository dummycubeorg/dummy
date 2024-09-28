import * as jose from "jose";
import { env } from "../env";

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export async function createAccessToken(payload: Record<string, unknown>) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1day")
    .sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
      typ: "JWT",
    });
    return payload;
  } catch (err) {
    console.error(err);
    return null;
  }
}
