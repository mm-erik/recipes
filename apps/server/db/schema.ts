import type { Ingredient } from "@recipes/recipe";
import { integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const recipesTable = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  ingredients: jsonb("ingredients").$type<Ingredient[]>().notNull(),
  steps: jsonb("steps").$type<string[]>().notNull(),
  servings: integer("servings").notNull(),
  prepTimeMinutes: integer("prep_time_minutes"),
  cookTimeMinutes: integer("cook_time_minutes"),
  tags: jsonb("tags").$type<string[]>().notNull(),
});
