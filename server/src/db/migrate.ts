import { Client } from "pg";
import { env } from "../env";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "./index";
import path from "path";

async function runMigrations() {
  const client = new Client({
    connectionString: env.DATABASE_URL,
  });

  try {
    await client.connect();

    const db = drizzle(client, {
      logger: true,
      schema,
    });

    await migrate(db, {
      migrationsFolder: path.resolve(__dirname, "./drizzle"),
    });
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}
runMigrations();
