# Client

The client workspace is a Lerna monorepo (`application/`, `packages/`, `tooling/`) containing the VSCode extension, GLSP diagram client and server, and the Langium-based model server.

## Requirements

- **VSCode**: <https://code.visualstudio.com/download>
- **Node v24.14.0**: <https://nodejs.org/en/download/releases/>
    - Or use NVM, see below

### Recommended (not necessary!)

It is recommended to use NVM. NVM allows you to manage different versions of Node. You can therefore install the required version for this repository and then switch again to the latest version for your other projects. You can use `nvm use` in the client folder to enable the correct version.

- **Link**: <https://github.com/nvm-sh/nvm>

## Getting Started

### First-time setup

```bash
# Optional: enable the correct Node version via NVM
nvm use

# Install dependencies, build tooling, generate code, and build everything
npm run setup
```

`npm run setup` runs the full pipeline: `npm ci` → build tooling → code generation → build all packages. Use this the first time or after a clean.

### Running the extension

1. Start the watch process so changes are rebuilt automatically:

    ```bash
    npm run watch
    ```

2. Launch the extension using `Ctrl+F5`, or open **Run and Debug** (`Ctrl+Shift+D`) and select `(Debug) UML GLSP VSCode Extension`.

3. After making code changes, reload the extension window with `Ctrl+R`. If the changes are only within a webview (e.g., property palette, minimap), you can use the `Reload Webview` command from the Command Palette instead of a full reload.

### Creating a new UML diagram

You can create a new `.uml` file in two ways:

- **Command Palette**: Open the Command Palette (`Ctrl+Shift+P`) and run `bigUML: New Empty UML Diagram`.
- **New File view**: Use the VSCode _New File…_ menu entry — bigUML registers as a file creation provider, so you can pick a UML diagram directly from the new-file view.

## Scripts

Key scripts defined in the root `package.json`:

| Script                  | Description                                                                |
| ----------------------- | -------------------------------------------------------------------------- |
| `npm run build`         | Clean build of all packages via Lerna (slower, full rebuild)               |
| `npm run build:tooling` | Build only the `uml-language-tooling` package                              |
| `npm run clean`         | Clean build outputs across all packages                                    |
| `npm run compile`       | Iterative TypeScript compilation across all packages (faster, incremental) |
| `npm run generate`      | Run code generation from the language definition                           |
| `npm run lint`          | Lint all packages                                                          |
| `npm run lint:fix`      | Lint and auto-fix all packages                                             |
| `npm run package`       | Package the extension into a `.vsix` file                                  |
| `npm run setup`         | Full first-time setup: install, build tooling, generate, and build         |
| `npm run watch`         | Watch and rebuild all packages in parallel                                 |

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
