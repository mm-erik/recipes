import type { z } from "zod";
import type { recipeInputSchema } from "./schema";

export type { Ingredient } from "./schema";
export type Recipe = z.infer<typeof recipeInputSchema>;

export type RecipeValidationError = {
  field: string;
  message: string;
};

export type CreateRecipeResult =
  | { ok: true; recipe: Recipe }
  | { ok: false; errors: RecipeValidationError[] };
