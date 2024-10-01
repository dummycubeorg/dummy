import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
  dialect: "postgresql",
  schema: `./src/db/**/schema.${env.NODE_ENV === "development" ? "ts" : "js"}`,
  out: "./src/db/drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
