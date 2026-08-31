import { buildRecipe } from "./lib/create";
import type { CreateRecipeResult } from "./lib/types";

export type { CreateRecipeResult, Ingredient, Recipe, RecipeValidationError } from "./lib/types";

export function createRecipe(input: unknown): CreateRecipeResult {
  return buildRecipe(input);
}
