import * as jose from "jose";

export async function verifyAccessToken(token: string, secret: Uint8Array) {
  try {
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: ["HS256"],
      typ: "JWT",
    });
    return payload;
  } catch (err) {
    // console.error(err);
    return null;
  }
}
