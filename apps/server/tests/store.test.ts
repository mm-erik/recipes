import { beforeEach, expect, test } from "bun:test";
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

test("save persists a recipe and returns it with a generated id", async () => {
  const store = createRecipeStore(testDb);

  const saved = await store.save(validRecipe);

  expect(typeof saved.id).toBe("string");
  expect(saved.recipe).toEqual(validRecipe);
});

test("list returns every persisted recipe", async () => {
  const store = createRecipeStore(testDb);

  const saved = await store.save(validRecipe);
  const listed = await store.list();

  expect(listed).toEqual([saved]);
});

test("list returns nothing when the store is empty", async () => {
  const store = createRecipeStore(testDb);

  expect(await store.list()).toEqual([]);
});
