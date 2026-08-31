# Packages

Every package under `packages/<name>/` is a **deep module**: a lot of behaviour behind a small interface.

```
packages/
  <name>/
    index.ts        ← an entry point (public). Import this from outside.
    client.ts        ← packages may expose several entry points, not just one
    lib/              ← implementation: hidden from outside, free to import each other
    tests/            ← co-located tests + fixtures (a subfolder, so private)
```

Import a package only through its **entry points** — its root files (`index.ts`, or any other file directly at the package root). Anything nested in a subfolder (`lib/`, `tests/`, or any other subfolder) is private, even to other packages, and even to that package's own tests. Prefer several small, purpose-named entry points (`index.ts`, `client.ts`, `server.ts`) over funnelling everything through one giant barrel `index.ts` that re-exports a whole subtree — barrels defeat the point of having a small interface.

The four rules `lint:boundaries` enforces, all errors:

1. **Entry-point boundary (from outside a package)**: app code or another package may import only a package's entry points, never anything inside its subfolders.
2. **Intra-package freedom**: a package's own files import each other freely.
3. **Tests through the entry points**: a package's `tests/` files may import any package's entry points and their own `tests/` fixtures, but never any package's subfolder internals — not even their own.
4. **No cycles**: no dependency cycles, anywhere.

Run `bun run lint:boundaries` to check. `packages/example/` is a working, committed template — copy it when starting a new package, or delete it once real packages exist.
