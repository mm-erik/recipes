export type Ingredient = {
  name: string;
  amount?: number;
  unit?: string;
};

export type Recipe = {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  servings: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  tags: string[];
};

export type RecipeValidationError = {
  field: string;
  message: string;
};

export type CreateRecipeResult =
  | { ok: true; recipe: Recipe }
  | { ok: false; errors: RecipeValidationError[] };
