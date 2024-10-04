import { createAccessToken } from "../src/utils/jwt/create-token";
import { verifyAccessToken } from "../src/utils/jwt/verify-token";

let mockSecret: Uint8Array;

beforeAll(() => {
  mockSecret = new TextEncoder().encode("mock-secret");
});

test("create and verify jwt tokens", async () => {
  const token = await createAccessToken({ id: 1 }, mockSecret);

  expect(token).toBeTruthy();

  const decoded = await verifyAccessToken(token, mockSecret);

  expect(decoded).toBeTruthy();

  expect(decoded!.id).toBe(1);
});

test("detects invalid jwt tokens", async () => {
  const decoded = await verifyAccessToken("invalid-token", mockSecret);

  expect(decoded).toBeNull();
});
