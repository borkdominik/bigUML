# big-revision-management — Development Notes

Revision management (the Timeline view) is **disabled** (since "Improve UML language", #224). The package is not
activated, and its view and commands are hidden. Its webview is still built by `application/vscode/esbuild.ts`,
and its `bigUML.timeline.*` settings are still contributed.

## Enable the feature

All paths are relative to `client/`.

1. **Extension** – `application/vscode/src/extension.config.ts`: uncomment the
   `import { revisionManagementModule } from '@borkdominik-biguml/big-revision-management/vscode';` import and the
   `revisionManagementModule(VSCodeSettings.revisionManagement.viewType)` entry in `container.load(...)`.
2. **Contributions** – `application/vscode/package.json`:
   - `contributes.views["bigUML-panel"]`: set `"when"` of `bigUML.panel.revision-management` to
     `"bigUML.isRunning"`.
   - `contributes.menus.commandPalette`: remove the `"when": "false"` entries of `timeline.import` and
     `timeline.export`.
3. Run `pnpm typecheck`, `pnpm lint` and `pnpm build`, then launch the extension.

## Notes

- The package still compiles, but it has not been tested against the reworked UML language since it was
  disabled. Check that snapshots are taken on save and can be imported and exported.
- See [README.md](README.md) for the feature itself.
