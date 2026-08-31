import { z } from "zod";

function nonEmptyString(message: string) {
  return z.string(message).refine((value) => value.trim() !== "", message);
}

const ingredientSchema = z.object({
  name: nonEmptyString("Ingredient name must not be empty."),
  amount: z.number().optional(),
  unit: z.string().optional(),
});

const stepSchema = nonEmptyString("Each step must be a non-empty string.");

export const recipeInputSchema = z.object({
  title: nonEmptyString("Title must not be empty."),
  ingredients: z
    .array(ingredientSchema, "At least one ingredient is required.")
    .min(1, "At least one ingredient is required."),
  steps: z
    .array(stepSchema, "At least one step is required.")
    .min(1, "At least one step is required."),
  servings: z
    .number("Servings must be a positive integer.")
    .refine((value) => Number.isInteger(value) && value > 0, "Servings must be a positive integer."),
  prepTimeMinutes: z.number().min(0, "Prep time must not be negative.").optional(),
  cookTimeMinutes: z.number().min(0, "Cook time must not be negative.").optional(),
  tags: z.array(z.string(), "Tags must be a list of strings.").default([]),
});

export type Ingredient = z.infer<typeof ingredientSchema>;
