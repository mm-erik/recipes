import { expect, test } from "bun:test";
import { app } from "../index";

test("recipe.create surfaces validation errors over HTTP, not just in-process", async () => {
  const response = await app.handle(
    new Request("http://localhost/trpc/recipe.create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: "",
        ingredients: [{ name: "flour" }],
        steps: ["Mix"],
        servings: 2,
        tags: [],
      }),
    }),
  );

  expect(response.status).toBe(400);
  const body = (await response.json()) as { error: { data: { errors?: unknown } } };
  expect(body.error.data.errors).toEqual([{ field: "title", message: "Title must not be empty." }]);
});
