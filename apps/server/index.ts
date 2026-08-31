import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Elysia } from "elysia";
import { createAppRouter } from "./router";
import { createRecipeStore } from "./store";

const appRouter = createAppRouter(createRecipeStore());

export const app = new Elysia().all("/trpc/*", ({ request }) =>
  fetchRequestHandler({
    endpoint: "/trpc",
    req: request,
    router: appRouter,
    createContext: () => ({}),
  }),
);

if (import.meta.main) {
  const port = 3000;
  app.listen(port);
  console.log(`Server listening on http://localhost:${port}`);
}
