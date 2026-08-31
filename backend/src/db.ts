import postgres from "postgres";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://recipes:recipes@localhost:5432/recipes";

export const sql = postgres(connectionString);
