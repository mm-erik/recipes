import type { Recipe } from "@recipes/recipe";

export type StoredRecipe = { id: string; recipe: Recipe };

export function createRecipeStore() {
  const recipes = new Map<string, Recipe>();

  return {
    save(recipe: Recipe): StoredRecipe {
      const id = crypto.randomUUID();
      recipes.set(id, recipe);
      return { id, recipe };
    },
    list(): StoredRecipe[] {
      return Array.from(recipes, ([id, recipe]) => ({ id, recipe }));
    },
  };
}
