import { verifyWebhook } from "@clerk/backend/webhooks";
import { eq } from "drizzle-orm";
import type { Db } from "../db/client";
import { usersTable } from "../db/schema";

export async function handleClerkWebhook(
  request: Request,
  db: Db,
  signingSecret?: string,
): Promise<Response> {
  let event;
  try {
    event = await verifyWebhook(request, { signingSecret });
  } catch {
    return new Response("Invalid webhook signature.", { status: 400 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated":
      await db.insert(usersTable).values({ id: event.data.id }).onConflictDoNothing();
      break;
    case "user.deleted":
      if (event.data.id) {
        await db.delete(usersTable).where(eq(usersTable.id, event.data.id));
      }
      break;
  }

  return new Response("OK", { status: 200 });
}
