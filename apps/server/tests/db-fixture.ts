import { sql } from "drizzle-orm";
import { createDbFromEnv } from "../db/client";

export const testDb = createDbFromEnv();

export async function resetTestDb() {
  await testDb.execute(sql`TRUNCATE TABLE recipes`);
}
