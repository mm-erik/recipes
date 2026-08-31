import type { RecipeValidationError } from "./types";

export function validateRecipeInput(input: Record<string, unknown>): RecipeValidationError[] {
  const errors: RecipeValidationError[] = [];

  if (typeof input.title !== "string" || input.title.trim() === "") {
    errors.push({ field: "title", message: "Title must not be empty." });
  }

  if (!Array.isArray(input.steps) || input.steps.length === 0) {
    errors.push({ field: "steps", message: "At least one step is required." });
  } else {
    input.steps.forEach((step, i) => {
      if (typeof step !== "string" || step.trim() === "") {
        errors.push({ field: `steps[${i}]`, message: "Each step must be a non-empty string." });
      }
    });
  }

  if (
    typeof input.servings !== "number" ||
    !Number.isInteger(input.servings) ||
    input.servings <= 0
  ) {
    errors.push({ field: "servings", message: "Servings must be a positive integer." });
  }

  if (!Array.isArray(input.ingredients) || input.ingredients.length === 0) {
    errors.push({ field: "ingredients", message: "At least one ingredient is required." });
  } else {
    input.ingredients.forEach((ingredient, i) => {
      const name = (ingredient as Record<string, unknown>)?.name;
      if (typeof name !== "string" || name.trim() === "") {
        errors.push({
          field: `ingredients[${i}].name`,
          message: "Ingredient name must not be empty.",
        });
      }
    });
  }

  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags) || input.tags.some((tag) => typeof tag !== "string")) {
      errors.push({ field: "tags", message: "Tags must be a list of strings." });
    }
  }

  if (input.prepTimeMinutes !== undefined && (input.prepTimeMinutes as number) < 0) {
    errors.push({ field: "prepTimeMinutes", message: "Prep time must not be negative." });
  }

  if (input.cookTimeMinutes !== undefined && (input.cookTimeMinutes as number) < 0) {
    errors.push({ field: "cookTimeMinutes", message: "Cook time must not be negative." });
  }

  return errors;
}
