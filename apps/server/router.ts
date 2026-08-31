import { createRecipe } from "@recipes/recipe";
import type { RecipeValidationError } from "@recipes/recipe";
import { initTRPC, TRPCError } from "@trpc/server";
import type { createRecipeStore } from "./store";

export class RecipeInputError extends TRPCError {
  errors: RecipeValidationError[];

  constructor(errors: RecipeValidationError[]) {
    super({ code: "BAD_REQUEST", message: "Invalid recipe input." });
    this.errors = errors;
  }
}

const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        errors: error instanceof RecipeInputError ? error.errors : undefined,
      },
    };
  },
});

export function createAppRouter(store: ReturnType<typeof createRecipeStore>) {
  return t.router({
    recipe: t.router({
      create: t.procedure.input((value: unknown) => value).mutation(({ input }) => {
        const result = createRecipe(input);
        if (!result.ok) {
          throw new RecipeInputError(result.errors);
        }
        return store.save(result.recipe);
      }),
      list: t.procedure.query(() => store.list()),
    }),
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;
