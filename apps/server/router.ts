import { createRecipe } from "@recipes/recipe";
import type { RecipeValidationError } from "@recipes/recipe";
import { initTRPC, TRPCError } from "@trpc/server";
import type { createRecipeStore } from "./store";

export type Context = { userId: string | null };

export class RecipeInputError extends TRPCError {
  errors: RecipeValidationError[];

  constructor(errors: RecipeValidationError[]) {
    super({ code: "BAD_REQUEST", message: "Invalid recipe input." });
    this.errors = errors;
  }
}

const t = initTRPC.context<Context>().create({
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

const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in required." });
  }
  return next({ ctx: { userId: ctx.userId } });
});

export function createAppRouter(store: ReturnType<typeof createRecipeStore>) {
  return t.router({
    recipe: t.router({
      create: protectedProcedure
        .input((value: unknown) => value)
        .mutation(({ ctx, input }) => {
          const result = createRecipe(input);
          if (!result.ok) {
            throw new RecipeInputError(result.errors);
          }
          return store.save(ctx.userId, result.recipe);
        }),
      list: protectedProcedure.query(({ ctx }) => store.list(ctx.userId)),
    }),
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;
