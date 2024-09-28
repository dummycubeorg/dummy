import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

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

  const decoded = await verifyAccessToken(token);

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
