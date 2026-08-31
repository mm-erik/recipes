import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export const DEFAULT_DATABASE_URL = "postgres://recipes:recipes@localhost:5432/recipes";

export function createDb(connectionString: string) {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
}

export function createDbFromEnv() {
  return createDb(process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL);
}

export type Db = ReturnType<typeof createDb>;
