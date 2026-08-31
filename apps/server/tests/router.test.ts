import { expect, test } from "bun:test";
import { createAppRouter, RecipeInputError } from "../router";
import { createRecipeStore } from "../store";

const validRecipeInput = {
  title: "Pancakes",
  ingredients: [{ name: "flour" }],
  steps: ["Mix"],
  servings: 2,
  tags: [],
};

function makeCaller() {
  return createAppRouter(createRecipeStore()).createCaller({});
}

test("recipe.create stores a valid recipe and returns it with an id", async () => {
  const result = await makeCaller().recipe.create(validRecipeInput);

  expect(typeof result.id).toBe("string");
  expect(result.recipe.title).toBe("Pancakes");
});

test("recipe.list returns every stored recipe", async () => {
  const caller = makeCaller();

  const created = await caller.recipe.create(validRecipeInput);
  const listed = await caller.recipe.list();

  expect(listed).toEqual([created]);
});

test("recipe.create rejects invalid input with a BAD_REQUEST TRPCError carrying the errors", async () => {
  try {
    await makeCaller().recipe.create({ ...validRecipeInput, title: "" });
    throw new Error("expected recipe.create to reject");
  } catch (error) {
    expect(error).toBeInstanceOf(RecipeInputError);
    expect((error as RecipeInputError).code).toBe("BAD_REQUEST");
    expect((error as RecipeInputError).errors).toEqual([
      { field: "title", message: "Title must not be empty." },
    ]);
  }
});
