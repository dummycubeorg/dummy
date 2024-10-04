import * as jose from "jose";

export async function createAccessToken(
  payload: Record<string, unknown>,
  secret: Uint8Array
) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1day")
    .sign(secret);
}
