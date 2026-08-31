import { beforeEach, expect, test } from "bun:test";
import { usersTable } from "../db/schema";
import { createRecipeStore } from "../store";
import { resetTestDb, testDb } from "./db-fixture";

beforeEach(resetTestDb);

const validRecipe = {
  title: "Pancakes",
  ingredients: [{ name: "flour" }],
  steps: ["Mix"],
  servings: 2,
  tags: [],
};

async function createUser(id: string) {
  await testDb.insert(usersTable).values({ id });
  return id;
}

test("save persists a recipe for the given user and returns it with a generated id", async () => {
  const userId = await createUser("user_1");
  const store = createRecipeStore(testDb);

  const saved = await store.save(userId, validRecipe);

  expect(typeof saved.id).toBe("string");
  expect(saved.recipe).toEqual(validRecipe);
});

test("list returns every recipe persisted for that user", async () => {
  const userId = await createUser("user_1");
  const store = createRecipeStore(testDb);

  const saved = await store.save(userId, validRecipe);
  const listed = await store.list(userId);

  expect(listed).toEqual([saved]);
});

test("list returns nothing when the user has no recipes", async () => {
  const userId = await createUser("user_1");
  const store = createRecipeStore(testDb);

  expect(await store.list(userId)).toEqual([]);
});

test("list does not return another user's recipes", async () => {
  const ownerId = await createUser("user_1");
  const otherId = await createUser("user_2");
  const store = createRecipeStore(testDb);

  await store.save(ownerId, validRecipe);

  expect(await store.list(otherId)).toEqual([]);
});
