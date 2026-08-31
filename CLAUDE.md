# CLAUDE.md

## Projektüberblick

Recipes: a fullstack app for managing private cooking recipes. Multi-user; each user owns a private recipe collection, no sharing in v1.

Stack: React + TS (TanStack Router/Query, Tailwind + shadcn/ui) ↔ tRPC ↔ Bun + TS (Elysia); Postgres + Drizzle; Clerk (users mirrored locally via webhook); MinIO (presigned direct uploads, server-generated thumbnails); self-hosted via Docker Compose.

Domain glossary: [CONTEXT.md](./CONTEXT.md). Architecture decisions: `docs/adr/`.

## Konventionen & Ablage

Bun workspaces monorepo: `apps/*` (applications), `packages/*` (deep-module libraries — see [packages/README.md](./packages/README.md) before adding or importing one).

`bun run lint:boundaries` (dependency-cruiser) needs Node ≥22 on `PATH`, even though the project runtime is otherwise Bun. TypeScript is pinned to `^6`; dependency-cruiser doesn't support 7.x yet.

In this dev environment, neither `bun` nor Node ≥22 is on `PATH` by default: `export PATH="$HOME/.bun/bin:$HOME/.nvm/versions/node/v22.23.2/bin:$PATH"` before running `bun test`, `bunx tsc --noEmit`, or `bun run lint:boundaries`.

## Arbeitsweise

Tickets, epics, and branches must be managed on GitHub.

## Output-Standards

Docs (this file, `CONTEXT.md`, ADRs) and code: English.

## Änderungsverlauf

- 2026-08-31: Grilled the domain model → `CONTEXT.md`; decided the stack (React/TS, Bun/TS, tRPC, Postgres+Drizzle, Clerk, MinIO, Docker Compose, Bun monorepo).
- 2026-08-31: Scaffolded the monorepo root and deep-module boundary tooling (dependency-cruiser + `packages/example`).
- 2026-08-31: Added Arbeitsweise section: tickets, epics, and branches must be managed on GitHub.
- 2026-08-31: Added `packages/recipe` (first real package, replacing `packages/example`): validates/creates a `Recipe` from untrusted input via `createRecipe`, returning aggregated errors instead of throwing (GitHub issue #1). Follow-up filed as issue #2: replace the hand-rolled field casts with a schema library (e.g. zod).
