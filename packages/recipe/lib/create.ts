import { formatIssuePath } from "./format-issue-path";
import { recipeInputSchema } from "./schema";
import type { CreateRecipeResult } from "./types";

export function buildRecipe(input: unknown): CreateRecipeResult {
  const result = recipeInputSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      errors: result.error.issues.map((issue) => ({
        field: formatIssuePath(issue.path),
        message: issue.message,
      })),
    };
  }

  return { ok: true, recipe: result.data };
}
