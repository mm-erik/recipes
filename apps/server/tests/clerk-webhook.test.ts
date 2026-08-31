import { beforeEach, expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { Webhook } from "svix";
import { usersTable } from "../db/schema";
import { handleClerkWebhook } from "../webhooks/clerk";
import { resetTestDb, testDb } from "./db-fixture";

const TEST_SIGNING_SECRET = "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw";

function signedRequest(body: unknown) {
  const payload = JSON.stringify(body);
  const id = "msg_test";
  const timestamp = new Date();
  const signature = new Webhook(TEST_SIGNING_SECRET).sign(id, timestamp, payload);

  return new Request("http://localhost/webhooks/clerk", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "svix-id": id,
      "svix-timestamp": String(Math.floor(timestamp.getTime() / 1000)),
      "svix-signature": signature,
    },
    body: payload,
  });
}

beforeEach(resetTestDb);

test("valid user.created event upserts a row in users", async () => {
  const request = signedRequest({
    type: "user.created",
    object: "event",
    data: { id: "user_123" },
  });

  const response = await handleClerkWebhook(request, testDb, TEST_SIGNING_SECRET);

  expect(response.status).toBe(200);
  const rows = await testDb.select().from(usersTable).where(eq(usersTable.id, "user_123"));
  expect(rows).toEqual([{ id: "user_123" }]);
});

test("user.deleted event removes the row from users", async () => {
  await testDb.insert(usersTable).values({ id: "user_456" });

  const request = signedRequest({
    type: "user.deleted",
    object: "event",
    data: { id: "user_456", object: "user", deleted: true },
  });

  const response = await handleClerkWebhook(request, testDb, TEST_SIGNING_SECRET);

  expect(response.status).toBe(200);
  const rows = await testDb.select().from(usersTable).where(eq(usersTable.id, "user_456"));
  expect(rows).toEqual([]);
});

test("an invalid signature is rejected with 400 and no row is written", async () => {
  const request = new Request("http://localhost/webhooks/clerk", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "svix-id": "msg_test",
      "svix-timestamp": String(Math.floor(Date.now() / 1000)),
      "svix-signature": "v1,not-a-real-signature",
    },
    body: JSON.stringify({ type: "user.created", object: "event", data: { id: "user_789" } }),
  });

  const response = await handleClerkWebhook(request, testDb, TEST_SIGNING_SECRET);

  expect(response.status).toBe(400);
  const rows = await testDb.select().from(usersTable).where(eq(usersTable.id, "user_789"));
  expect(rows).toEqual([]);
});
