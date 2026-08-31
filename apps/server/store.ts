import type { Recipe } from "@recipes/recipe";
import type { Db } from "./db/client";
import { recipesTable } from "./db/schema";

export type StoredRecipe = { id: string; recipe: Recipe };

export function createRecipeStore(db: Db) {
  return {
    async save(recipe: Recipe): Promise<StoredRecipe> {
      const [row] = await db.insert(recipesTable).values(recipe).returning();
      return toStoredRecipe(row);
    },
    async list(): Promise<StoredRecipe[]> {
      const rows = await db.select().from(recipesTable);
      return rows.map(toStoredRecipe);
    },
  };
}

function toStoredRecipe(row: typeof recipesTable.$inferSelect): StoredRecipe {
  return {
    id: row.id,
    recipe: {
      title: row.title,
      ingredients: row.ingredients,
      steps: row.steps,
      servings: row.servings,
      prepTimeMinutes: row.prepTimeMinutes ?? undefined,
      cookTimeMinutes: row.cookTimeMinutes ?? undefined,
      tags: row.tags,
    },
  };
}
