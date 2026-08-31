import { defineConfig } from "drizzle-kit";
import { DEFAULT_DATABASE_URL } from "./db/client";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
  },
});
