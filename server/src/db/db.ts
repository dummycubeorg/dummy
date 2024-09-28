import { Pool } from "pg";
import { env } from "../env";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./index";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema,
  logger: true,
});

export type DB = typeof db;
