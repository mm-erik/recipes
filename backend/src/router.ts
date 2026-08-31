import { initTRPC } from "@trpc/server";
import { sql } from "./db";

const t = initTRPC.create();

export const appRouter = t.router({
  health: t.procedure.query(async () => {
    await sql`select 1`;
    return { status: "ok" as const };
  }),
});

export type AppRouter = typeof appRouter;
