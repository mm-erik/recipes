import type { Recipe } from "@recipes/recipe";
import { eq } from "drizzle-orm";
import type { Db } from "./db/client";
import { recipesTable } from "./db/schema";

export type StoredRecipe = { id: string; recipe: Recipe };

export function createRecipeStore(db: Db) {
  return {
    async save(userId: string, recipe: Recipe): Promise<StoredRecipe> {
      const [row] = await db
        .insert(recipesTable)
        .values({ ...recipe, userId })
        .returning();
      return toStoredRecipe(row);
    },
    async list(userId: string): Promise<StoredRecipe[]> {
      const rows = await db.select().from(recipesTable).where(eq(recipesTable.userId, userId));
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
