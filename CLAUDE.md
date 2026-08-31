# CLAUDE.md

## Project Overview

"Recipes": a platform where users create and manage their own cooking recipes with step-by-step instructions and photos.

Stack: React/TS frontend, Bun/TS backend, Postgres (DB), Clerk (auth), MinIO (image hosting). Everything runs locally via Docker Compose — currently only Postgres and MinIO are containerized; frontend and backend run locally in dev mode (hot reload) for now.

Domain model lives in `CONTEXT.md` at the repo root (single-context repo). Architecture decisions live in `docs/adr/`.

## Conventions & Storage

- `CONTEXT.md` at repo root — glossary only, no implementation details.
- `docs/adr/` — sequentially numbered ADRs (`0001-slug.md`, ...).
- Bun workspace monorepo: `backend/` (Bun + tRPC) and `frontend/` (Vite + React), linked via the root `package.json`'s `workspaces` field so the frontend's tRPC client can `import type` the backend's router directly (per ADR-0002). Root `bun install` sets up both.
- `docker-compose.yml` at repo root: Postgres + MinIO only; frontend/backend run as local dev processes (`bun run dev` in each package).

## Working Style

- Domain model built collaboratively via the `grilling` + `domain-modeling` skills — decisions are the user's, facts are looked up, not assumed.
- Communicate in English (per user preference, set 2026-08-31).
- Keep replies short and to the point; only elaborate when asked.
- Ask before assuming on anything ambiguous.

## Output Standards

- Markdown files (`CONTEXT.md`, ADRs) follow the formats in `.claude/skills/domain-modeling/`.
- Dates in ADRs/changelogs: `YYYY-MM-DD`.

## Agent skills

### Issue tracker

Issues live as GitHub issues in `mm-erik/recipes`, managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical labels (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.

## Change Log

- 2026-08-31: Initial domain-modeling session. Established core domain: Recipe (private, owned by User), RecipeIngredient (normalized Ingredient + quantity + Unit), Image/Thumbnail/Step (Steps paired positionally with non-thumbnail Images by upload order, counts need not match). Decided: local User table mirrored from Clerk via webhook; Docker Compose covers only Postgres + MinIO for now. Created ADR 0001 (normalized ingredients). Step-image-coupling ADR deferred to a later session.
- 2026-08-31: Implemented issue #13 (project scaffolding). Added `docker-compose.yml` (Postgres + MinIO), a Bun/tRPC backend with a Postgres-backed health-check procedure, and a Vite/React frontend calling it through a typed tRPC client with the Clerk SDK wired in (no routes protected yet). Introduced a root Bun workspace to link `backend/`/`frontend/` for ADR-0002's type-sharing guarantee. Committed as `8fe72d0` (domain docs) and `21d5e4d` (scaffolding); pushed to `main`.
