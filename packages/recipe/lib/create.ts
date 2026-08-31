import type { CreateRecipeResult, Ingredient, Recipe } from "./types";
import { validateRecipeInput } from "./validate";

export function buildRecipe(input: Record<string, unknown>): CreateRecipeResult {
  const errors = validateRecipeInput(input);
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const recipe: Recipe = {
    title: input.title as string,
    ingredients: input.ingredients as Ingredient[],
    steps: input.steps as string[],
    servings: input.servings as number,
    prepTimeMinutes: input.prepTimeMinutes as number | undefined,
    cookTimeMinutes: input.cookTimeMinutes as number | undefined,
    tags: (input.tags as string[]) ?? [],
  };

  return { ok: true, recipe };
}
