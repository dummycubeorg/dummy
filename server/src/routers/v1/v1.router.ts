import { type Request, type Response, Router } from "express";
import { registerSchema, loginSchema } from "./v1.validation";
import { db } from "../../db/db";
import { users } from "../../db/index";
import { eq, or } from "drizzle-orm";
import argon2 from "argon2";
import { createAccessToken } from "../../utils/jwt";
import { env } from "../../env";
import { authenticated } from "../../middlewares/auth";

const v1 = Router();

v1.post("/register", async (req: Request, res: Response) => {
  const { data, success } = await registerSchema.safeParseAsync(req.body);

  if (!success) {
    res.status(400).json({
      code: "BAD_REQUEST",
      error: "Invalid request body",
      message: "Invalid data",
    });
    return;
  }

  const { email, username, password } = data;

  try {
    const user = (
      await db
        .select({ id: users.id })
        .from(users)
        .where(or(eq(users.email, email), eq(users.username, username)))
        .limit(1)
        .execute()
    )[0];

    if (user) {
      res.status(400).json({
        code: "BAD_REQUEST",
        error: "User already exists",
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await argon2.hash(password);

    const inserted = await db
      .insert(users)
      .values({
        email,
        username,
        password: hashedPassword,
      })
      .returning()
      .execute();

    const { password: _, ...others } = inserted[0];

    res.status(201).json({
      code: "CREATED",
      message: "Registered successfully",
      data: others,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      error: "Internal server error",
      message: "Unexpected error occurred",
    });
  }
});

v1.post("/login", async (req: Request, res: Response) => {
  const { data, success } = await loginSchema.safeParseAsync(req.body);

  if (!success) {
    res.status(400).json({
      code: "BAD_REQUEST",
      error: "Invalid request body",
      message: "Invalid data",
    });
    return;
  }

  const { email, password } = data;

  try {
    const user = (
      await db
        .select({ id: users.id, password: users.password })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .execute()
    )[0];

    if (!user) {
      res.status(401).json({
        code: "UNAUTHORIZED",
        error: "Invalid credentials",
        message: "Incorrect email/password",
      });
      return;
    }

    if (!(await argon2.verify(user.password, password))) {
      res.status(401).json({
        code: "UNAUTHORIZED",
        error: "Invalid credentials",
        message: "Invalid email/password",
      });
      return;
    }

    const token = await createAccessToken({ id: user.id });

    res.cookie("uid", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({
      code: "OK",
      message: "Logged in successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      error: "Internal server error",
      message: "Unexpected error occurred",
    });
  }
});

v1.post("/logout", authenticated, async (req: Request, res: Response) => {
  res.clearCookie("uid");
  res.status(200).json({
    code: "OK",
    message: "Logged out successfully",
  });
});

v1.get("/me", authenticated, async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const user = (
    await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .execute()
  )[0];

  if (!user) {
    res.status(404).json({
      code: "NOT_FOUND",
      error: "User not found",
      message: "User not found",
    });
    return;
  }

  res.status(200).json({
    code: "OK",
    data: user,
  });
});

export const v1Router = v1;
