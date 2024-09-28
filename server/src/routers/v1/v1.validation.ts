import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1).max(255),
  password: z.string().min(8),
  email: z.string().email(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
