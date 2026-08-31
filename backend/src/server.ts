import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./router";

const port = Number(process.env.PORT ?? 3001);

const server = createHTTPServer({
  router: appRouter,
  responseMeta: () => ({
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
    },
  }),
});

server.listen(port);

console.log(`Backend listening on http://localhost:${port}`);
