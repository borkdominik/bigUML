---
name: 'Typescript Standards'
description: 'Coding conventions for TypeScript files'
applyTo: '**/*.ts'
---

# TypeScript coding standards

- Follow the TypeScript style guide.
- Always use `export * from` syntax for re-exports.
- Use `import type` for type-only imports.
- Use `import` for value imports.

# Project architecture

## VSCode extension process (`application/vscode/src/extension.config.ts`)

- Registers InversifyJS `ContainerModule` instances for the **VSCode extension host** process.
- Contains: webview providers (`BIGReactWebview`), VSCode-side action handlers, services using `TYPES` / `EXPERIMENTAL_TYPES` from `@borkdominik-biguml/big-vscode/vscode`.
- Each package exposes a `*Module(viewId)` factory returning a `ContainerModule` under the `./vscode` export.

## GLSP server process (`application/vscode/src/main.ts`)

- Registers `FeatureDiagramModule` instances passed to `startGLSPServer(...)`.
- Contains: GLSP protocol action handlers (`ActionHandlerConstructor` from `@eclipse-glsp/server`), operation handlers for the diagram server.
- Each package exposes a module constant under the `./glsp-server` export.

## Folder organisation within a package

- `src/env/vscode/` — VSCode extension-side code (providers, services, VSCode container modules). Bound in `extension.config.ts`.
- `src/env/glsp-server/` — GLSP server-side code (action/operation handlers registered on the GLSP server, `FeatureDiagramModule`). Referenced from `main.ts`.
- A handler that uses `TYPES.ActionDispatcher`, `TYPES.ActionListener`, or `EXPERIMENTAL_TYPES.*` from `@borkdominik-biguml/big-vscode/vscode` is a **VSCode-side** handler — it belongs in `src/env/glsp-server/` for organisational clarity but is still **bound in the VSCode container** (`extension.config.ts`), not in `main.ts`.
- A handler that implements `@eclipse-glsp/server` action/operation handler interfaces is a **GLSP server-side** handler — it goes in `src/env/glsp-server/` and is registered via `FeatureDiagramModule` in `main.ts`.
