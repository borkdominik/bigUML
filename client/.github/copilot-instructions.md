## Summary

bigUML is a graphical UML modeling tool built as a VSCode extension. It uses a Lerna monorepo (`application/`, `packages/`, `tooling/`) with three runtime processes: the **Extension Host** (VSCode), the **Language Server** (Langium, port 5999), and the **GLSP Diagram Server** (port 5007). A code generation pipeline produces boilerplate from a single language definition file (`tooling/uml-language/src/language/def.ts`).

## Terminology

- **Environment (`env`)** - A target runtime context (`common`, `vscode`, `glsp-server`, `glsp-client`, `browser`, `jsx`). Each package splits source into `src/env/<environment>/` folders.
- **GLSP** - Graphical Language Server Platform. Framework for diagram editors with a client-server architecture. The server manages model operations; the client renders in a webview.
- **Langium** - Parser framework providing the Language Server Protocol (LSP) for `.uml` files, including parsing, validation, scoping, and serialization.
- **Model Server** - JSON-RPC facade (`localhost:5999`) exposing the Langium AST to non-LSP clients (primarily the GLSP server). Supports JSON patch mutations with undo/redo.

## Architecture

Each feature package contributes to one or more processes through an environment-based folder convention:

| Import path     | Registered in                          | Runtime                  |
| --------------- | -------------------------------------- | ------------------------ |
| `./vscode`      | `extension.config.ts` → DI container   | Extension host (Node.js) |
| `./glsp-server` | `server.main.ts` → `startGLSPServer()` | Server process (Node.js) |
| `./glsp-client` | GLSP client container in webview       | Browser                  |
| `.` (common)    | Imported by any environment            | Shared                   |

Key architectural rules:

- Never import `sprotty` or `sprotty-protocol` directly. Use `@eclipse-glsp/client` re-exports instead.
- Files in `src/gen/` are machine-generated. Never edit them manually. Regenerate with `npm run generate`.
- Each process has its own InversifyJS DI container. Do not share container instances across processes.
- The GLSP server communicates with the model server via JSON-RPC. Model mutations always flow through JSON patches, never through direct AST manipulation.

## Task planning and problem-solving

- Before implementing, examine the relevant `src/env/` folder to understand which process the code runs in.
- Before adding new code, check if an existing pattern in the same package already solves the problem. Reuse existing base classes (`BaseWebviewProvider`, `VSCodeCommand`, generic operation handlers).
- When adding a new UML element: modify `tooling/uml-language/src/language/def.ts` and run `npm run generate`. Do not create handlers manually.
- When adding a new feature package: follow the environment folder convention (`src/env/{common,vscode,glsp-server,glsp-client,browser}/`), expose exports via `package.json` exports map, and register modules in `extension.config.ts` and/or `server.main.ts`.

## Verification

Before running `npm run compile`, ask the user - they may already have a watch process running.

## Documentation

Technical documentation lives in `docs/`. Read these only when working on a related area:

| Document                                     | Topic                                                                         |
| -------------------------------------------- | ----------------------------------------------------------------------------- |
| `docs/architecture-overview.md`              | System-wide architecture, startup sequence, environment model, package layers |
| `docs/glsp-server-architecture.md`           | GLSP server internals, operation handlers, GModel creation, JSON patch flow   |
| `docs/model-server.md`                       | Langium model server, RPC protocol, multi-client coordination, undo/redo      |
| `docs/guides/command-registration.md`        | How to register VSCode commands via DI                                        |
| `docs/guides/webview-registration.md`        | How to register webviews, messaging, and bundling                             |
| `docs/guides/glsp-server-feature-modules.md` | How feature packages extend the GLSP server                                   |
| `docs/guides/property-palette-generator.md`  | Code generation pipeline using the property palette as example                |

## Self-maintenance

If you notice during work that an instruction file (`.github/instructions/*.instructions.md`) or `copilot-instructions.md` contains outdated, incorrect, or missing information, propose the update to the user before applying it.
