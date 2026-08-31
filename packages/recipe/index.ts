import { buildRecipe } from "./lib/create";
import type { CreateRecipeResult } from "./lib/types";

export type { CreateRecipeResult, Ingredient, Recipe, RecipeValidationError } from "./lib/types";

export function createRecipe(input: Record<string, unknown>): CreateRecipeResult {
  return buildRecipe(input);
}
