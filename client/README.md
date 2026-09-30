# Client

The client workspace is a pnpm monorepo (`application/`, `packages/`, `tooling/`) containing the VSCode extension, GLSP diagram client and server, and the Langium-based model server.

Packages are never compiled on their own: they export their TypeScript sources directly, and `application/vscode/esbuild.ts` bundles the extension, the server and all webviews from those sources. TypeScript 7 (`tsc`) is used for type checking only.

## Requirements

- **VSCode**: <https://code.visualstudio.com/download>
- **Node v24.14.0**: <https://nodejs.org/en/download/releases/>
  - Or use NVM, see below
- **pnpm**: <https://pnpm.io/installation> (e.g. `corepack enable`, the version is pinned in `package.json`)

### Recommended (not necessary!)

It is recommended to use NVM. NVM allows you to manage different versions of Node. You can therefore install the required version for this repository and then switch again to the latest version for your other projects. You can use `nvm use` in the client folder to enable the correct version.

- **Link**: <https://github.com/nvm-sh/nvm>

## Getting Started

### First-time setup

```bash
# Optional: enable the correct Node version via NVM
nvm use

# Install dependencies and build the extension
pnpm run setup
```

`pnpm run setup` runs `pnpm install` and `pnpm build`. Generated code (`src/gen/`) is committed, so no generation step is needed.

### Running the extension

1. Start the development processes:

   ```bash
   pnpm dev
   ```

   This runs three watchers in one terminal:

   - **esbuild** rebuilds the extension, the server and all webviews on every change.
   - **check** ([nodemon](https://nodemon.io/)) re-runs type checking and linting on every change.
   - **generate** (nodemon) re-runs code generation when the language definition (`tooling/uml-language`), the generator tooling or a package's `generator/` changes. The regenerated `src/gen` is then rebuilt and checked by the other two.

   `pnpm watch` is an alias. In VSCode you can run the `Dev` task instead, which reports the results in the _Problems_ view.

2. Launch the extension using `Ctrl+F5`, or open **Run and Debug** (`Ctrl+Shift+D`) and select `Launch Extension` (or `Debug Extension` to also attach to the language server).

3. After making code changes, reload the extension window with `Ctrl+R`. If the changes are only within a webview (e.g., property palette, minimap), you can use the `Reload Webview` command from the Command Palette instead of a full reload.

### Creating a new UML diagram

You can create a new `.uml` file in two ways:

- **Command Palette**: Open the Command Palette (`Ctrl+Shift+P`) and run `bigUML: New Empty UML Diagram`.
- **New File view**: Use the VSCode _New File…_ menu entry — bigUML registers as a file creation provider, so you can pick a UML diagram directly from the new-file view.

## Scripts

Key scripts defined in the root `package.json`:

| Script                | Description                                                                    |
| --------------------- | ------------------------------------------------------------------------------ |
| `pnpm build`          | Bundle extension, server and webviews into `application/vscode`                |
| `pnpm dev`            | Watch everything: esbuild + type check / lint + code generation (`pnpm watch`) |
| `pnpm check`          | Type check, lint and knip once                                                 |
| `pnpm check:watch`    | Type check / lint daemon only (nodemon)                                        |
| `pnpm typecheck`      | Type check the node and browser projects (`configs/ts/`) with TypeScript 7     |
| `pnpm lint`           | Lint with oxlint (including type-aware rules)                                  |
| `pnpm knip`           | Report unused dependencies (errors) and unused files/exports (warnings)        |
| `pnpm lint:fix`       | Lint and auto-fix                                                              |
| `pnpm format`         | Format with oxfmt                                                              |
| `pnpm format:check`   | Check formatting                                                               |
| `pnpm generate`       | Run code generation from the language definition                               |
| `pnpm generate:watch` | Re-run code generation when the language definition or generators change       |
| `pnpm test`           | Run the tests                                                                  |
| `pnpm run clean`      | Remove build outputs and caches                                                |
| `pnpm package`        | Package the extension into a `.vsix` file                                      |
| `pnpm hooks:install`  | Opt in to the pre-commit hook (oxfmt + oxlint on staged files, `lefthook.yml`) |
| `pnpm run setup`      | First-time setup: install and build (`pnpm setup` is a pnpm built-in)          |

To inspect bundle sizes, run `pnpm -C application/vscode run build:analyze`; it prints the largest inputs per bundle and writes esbuild metafiles to `application/vscode/build/meta/` (open them in <https://esbuild.github.io/analyze/>).

Shared configuration lives in `configs/` (`configs/ts` for TypeScript, `configs/nodemon` for the daemons, `configs/oxlint` for the local lint rules). `.oxlintrc.json` and `.oxfmtrc.json` stay in the root so that the editor extensions find them.

## Documentation

Technical documentation lives in [`docs/`](./docs/README.md):

**Architecture** — reference material covering system design and core subsystems:

- [Architecture Overview](./docs/architecture-overview.md) — startup sequence, environment model, package layers
- [GLSP Server Architecture](./docs/glsp-server-architecture.md) — operation handlers, GModel creation, JSON patch flow
- [Model Server](./docs/model-server.md) — Langium RPC protocol, multi-client coordination, undo/redo

**Guides** — task-oriented how-tos:

- [Command Registration](./docs/guides/command-registration.md) — register VSCode commands via DI
- [Webview Registration](./docs/guides/webview-registration.md) — webviews, messaging, and bundling
- [GLSP Server Feature Modules](./docs/guides/glsp-server-feature-modules.md) — extend the GLSP server with feature packages
- [Code Generation Pipeline](./docs/guides/property-palette-generator.md) — generation pipeline using the property palette as example

## Copilot Skills

The project ships with pre-built Copilot skills (`.github/skills/`) that automate common development tasks. Ask Copilot to use a skill by describing the task — it will match the appropriate one automatically.

| Skill                   | Purpose                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| **docs**                | Create or update technical documentation                                                       |
| **new-feature-package** | Scaffold a new feature package with environment folders, DI modules, and exports map           |
| **new-glsp-action**     | Add a GLSP action with server-side handler and optional client-side dispatch                   |
| **new-uml-element**     | Add a new UML element end-to-end: define in `def.ts`, generate code, and render in the diagram |
| **new-vscode-command**  | Add a VSCode command with DI-based registration and `package.json` declaration                 |
| **new-webview**         | Add a webview (sidebar, panel, or custom editor) with React entry point and messaging          |
| **skill-creator**       | Create new skills or improve existing ones                                                     |
