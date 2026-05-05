---
name: 'VSCode Extension'
description: 'Conventions for the VSCode extension host and webview registration'
applyTo: 'application/vscode/**,packages/big-vscode/**,**/env/vscode/**'
---

# VSCode extension conventions

Code matched by this instruction runs in the **VSCode extension host** (Node.js). It is bound in `application/vscode/src/extension.config.ts`.

## DI container

- The root container is created by `vscodeModule()` from `@borkdominik-biguml/big-vscode/vscode`.
- Feature packages expose a `*Module(viewId)` factory returning an InversifyJS `ContainerModule` from their `./vscode` export.
- All modules are loaded in `extension.config.ts` via `container.load(...)`.
- Use `TYPES` from `@borkdominik-biguml/big-vscode/vscode` for all DI symbols.

## Key DI symbols (`TYPES`)

| Symbol | Purpose |
|--------|---------|
| `TYPES.Command` | Multi-inject: `VSCodeCommand` implementations collected by `CommandManager` |
| `TYPES.OnActivate` | Multi-inject: services that run on extension activation |
| `TYPES.OnDispose` | Multi-inject: services that clean up on deactivation |
| `TYPES.ActionDispatcher` | Dispatches GLSP actions from the extension host |
| `TYPES.ActionListener` | Listens for GLSP actions in the extension host |
| `TYPES.GlspVSCodeConnector` | Bridge between VSCode and the GLSP server |
| `TYPES.SelectionService` | Tracks selected diagram elements |
| `TYPES.WebviewViewFactory` | Multi-inject: webview view provider factories |
| `TYPES.WebviewEditorFactory` | Multi-inject: webview editor provider factories |
| `TYPES.WebviewMessenger` | Per-webview typed RPC messenger |
| `TYPES.ActionWebviewMessenger` | Per-webview GLSP action messenger |

## Command registration

1. Implement `VSCodeCommand` interface (`id` + `execute()`).
2. Bind to `TYPES.Command` in a `VscodeFeatureModule`.
3. `CommandManager` auto-registers all bound commands on activation via `@multiInject`.
4. Also add the command to `application/vscode/package.json` → `contributes.commands`.

For details, see `docs/guides/command-registration.md`.

## Webview registration

1. Extend `WebviewViewProvider` (sidebar/panel) or `WebviewEditorProvider` (custom editor).
2. Use `bindWebviewViewFactory()` or `bindWebviewEditorFactory()` in a `VscodeFeatureModule`.
3. Each webview gets its own child DI container with scoped `WebviewMessenger` and `ActionWebviewMessenger`.
4. Bundle the browser entry point with esbuild into `application/vscode/webviews/<name>/`.
5. Add `contributes.viewsContainers` and `contributes.views` entries in `application/vscode/package.json`.

For details, see `docs/guides/webview-registration.md`.

## Extension bootstrap

1. `index.ts` → `activate()` calls `activateServer()` then `activateClient()`.
2. `extension.server.ts` → spawns the language server child process.
3. `extension.client.ts` → creates the DI container, fires `OnActivate` hooks, connects to GLSP.
4. `extension.config.ts` → loads all feature `ContainerModule` instances.

## Documentation

Read only when you need deeper context:

- `docs/guides/command-registration.md` - Full command registration guide
- `docs/guides/webview-registration.md` - Full webview registration guide
- `docs/architecture-overview.md` - System-wide architecture and startup sequence
