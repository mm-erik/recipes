import { expect, test } from "bun:test";
import { createRecipe } from "../index";

test("empty title is rejected", () => {
  const result = createRecipe({
    title: "",
    ingredients: [{ name: "flour" }],
    steps: ["Mix"],
    servings: 1,
    tags: [],
  });

  expect(result).toEqual({
    ok: false,
    errors: [{ field: "title", message: "Title must not be empty." }],
  });
});

test("empty steps list is rejected", () => {
  const result = createRecipe({
    title: "Pancakes",
    ingredients: [{ name: "flour" }],
    steps: [],
    servings: 1,
    tags: [],
  });

  expect(result).toEqual({
    ok: false,
    errors: [{ field: "steps", message: "At least one step is required." }],
  });
});

test("zero servings is rejected", () => {
  const result = createRecipe({
    title: "Pancakes",
    ingredients: [{ name: "flour" }],
    steps: ["Mix"],
    servings: 0,
    tags: [],
  });

  expect(result).toEqual({
    ok: false,
    errors: [{ field: "servings", message: "Servings must be a positive integer." }],
  });
});

test("multiple invalid fields are all reported together", () => {
  const result = createRecipe({
    title: "",
    ingredients: [{ name: "flour" }],
    steps: ["Mix"],
    servings: 0,
    tags: [],
  });

  expect(result).toEqual({
    ok: false,
    errors: [
      { field: "title", message: "Title must not be empty." },
      { field: "servings", message: "Servings must be a positive integer." },
    ],
  });
});

test("ingredient missing a name is rejected", () => {
  const result = createRecipe({
    title: "Pancakes",
    ingredients: [{ amount: 2, unit: "cups" }],
    steps: ["Mix"],
    servings: 1,
    tags: [],
  });

  expect(result).toEqual({
    ok: false,
    errors: [{ field: "ingredients[0].name", message: "Ingredient name must not be empty." }],
  });
});

test("missing ingredients is rejected", () => {
  const result = createRecipe({
    title: "Pancakes",
    steps: ["Mix"],
    servings: 1,
    tags: [],
  });

  expect(result).toEqual({
    ok: false,
    errors: [{ field: "ingredients", message: "At least one ingredient is required." }],
  });
});

test("non-array tags is rejected", () => {
  const result = createRecipe({
    title: "Pancakes",
    ingredients: [{ name: "flour" }],
    steps: ["Mix"],
    servings: 1,
    tags: "breakfast",
  });

  expect(result).toEqual({
    ok: false,
    errors: [{ field: "tags", message: "Tags must be a list of strings." }],
  });
});

test("non-string step is rejected", () => {
  const result = createRecipe({
    title: "Pancakes",
    ingredients: [{ name: "flour" }],
    steps: ["Mix", 42],
    servings: 1,
    tags: [],
  });

  expect(result).toEqual({
    ok: false,
    errors: [{ field: "steps[1]", message: "Each step must be a non-empty string." }],
  });
});

test("negative prep and cook times are rejected", () => {
  const result = createRecipe({
    title: "Pancakes",
    ingredients: [{ name: "flour" }],
    steps: ["Mix"],
    servings: 1,
    prepTimeMinutes: -5,
    cookTimeMinutes: -1,
    tags: [],
  });

  expect(result).toEqual({
    ok: false,
    errors: [
      { field: "prepTimeMinutes", message: "Prep time must not be negative." },
      { field: "cookTimeMinutes", message: "Cook time must not be negative." },
    ],
  });
});

test("prep and cook times are carried through when present", () => {
  const result = createRecipe({
    title: "Pancakes",
    ingredients: [{ name: "flour" }],
    steps: ["Mix"],
    servings: 1,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    tags: [],
  });

  expect(result.ok).toBe(true);
  expect(result.ok && result.recipe.prepTimeMinutes).toBe(10);
  expect(result.ok && result.recipe.cookTimeMinutes).toBe(15);
});

test("valid input creates a recipe", () => {
  const result = createRecipe({
    title: "Pancakes",
    ingredients: [{ name: "flour", amount: 2, unit: "cups" }],
    steps: ["Mix", "Cook"],
    servings: 4,
    tags: ["breakfast"],
  });

  expect(result).toEqual({
    ok: true,
    recipe: {
      title: "Pancakes",
      ingredients: [{ name: "flour", amount: 2, unit: "cups" }],
      steps: ["Mix", "Cook"],
      servings: 4,
      prepTimeMinutes: undefined,
      cookTimeMinutes: undefined,
      tags: ["breakfast"],
    },
  });
});
