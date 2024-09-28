import { parseEnv } from "znv";
import { z } from "zod";

export const env = parseEnv(process.env, {
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url(),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(1),
});
