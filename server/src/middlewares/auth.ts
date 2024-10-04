import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt/verify-token";
import { env } from "../env";

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export async function authenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.cookies) {
    res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
    return;
  }

  const token = req.cookies.uid;

  if (!token) {
    res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
    return;
  }

  const decoded = await verifyAccessToken(token, JWT_SECRET);

  if (!decoded) {
    res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
    return;
  }

  (req as any).userId = decoded.id;
  next();
}
