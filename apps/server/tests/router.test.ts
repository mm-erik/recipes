import { beforeEach, expect, test } from "bun:test";
import { usersTable } from "../db/schema";
import { createAppRouter, RecipeInputError } from "../router";
import { createRecipeStore } from "../store";
import { resetTestDb, testDb } from "./db-fixture";

const validRecipeInput = {
  title: "Pancakes",
  ingredients: [{ name: "flour" }],
  steps: ["Mix"],
  servings: 2,
  tags: [],
};

function makeCaller(userId: string | null) {
  return createAppRouter(createRecipeStore(testDb)).createCaller({ userId });
}

async function createUser(id: string) {
  await testDb.insert(usersTable).values({ id });
  return id;
}

beforeEach(resetTestDb);

test("recipe.create stores a valid recipe for the signed-in user and returns it with an id", async () => {
  const userId = await createUser("user_1");

  const result = await makeCaller(userId).recipe.create(validRecipeInput);

  expect(typeof result.id).toBe("string");
  expect(result.recipe.title).toBe("Pancakes");
});

test("recipe.list returns only the signed-in user's recipes", async () => {
  const ownerId = await createUser("user_1");
  const otherId = await createUser("user_2");

  const created = await makeCaller(ownerId).recipe.create(validRecipeInput);
  await makeCaller(otherId).recipe.create(validRecipeInput);

  const listed = await makeCaller(ownerId).recipe.list();

  expect(listed).toEqual([created]);
});

test("recipe.create rejects invalid input with a BAD_REQUEST TRPCError carrying the errors", async () => {
  const userId = await createUser("user_1");

  try {
    await makeCaller(userId).recipe.create({ ...validRecipeInput, title: "" });
    throw new Error("expected recipe.create to reject");
  } catch (error) {
    expect(error).toBeInstanceOf(RecipeInputError);
    expect((error as RecipeInputError).code).toBe("BAD_REQUEST");
    expect((error as RecipeInputError).errors).toEqual([
      { field: "title", message: "Title must not be empty." },
    ]);
  }
});

test("recipe.create is rejected with UNAUTHORIZED when there is no signed-in user", async () => {
  try {
    await makeCaller(null).recipe.create(validRecipeInput);
    throw new Error("expected recipe.create to reject");
  } catch (error) {
    expect((error as { code: string }).code).toBe("UNAUTHORIZED");
  }
});

test("recipe.list is rejected with UNAUTHORIZED when there is no signed-in user", async () => {
  try {
    await makeCaller(null).recipe.list();
    throw new Error("expected recipe.list to reject");
  } catch (error) {
    expect((error as { code: string }).code).toBe("UNAUTHORIZED");
  }
});
