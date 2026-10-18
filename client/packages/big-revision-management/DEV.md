# big-revision-management — Development Notes

Revision management (the Timeline view) is **disabled** (since "Improve UML language", #224). The package is not
activated, its view and commands are hidden, and its `bigUML.timeline.*` settings are removed. Its webview is
still built by `application/vscode/esbuild.ts`.

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
3. **Settings** – `application/vscode/package.json`: restore the settings under `contributes`. If
   `contributes.configuration` exists already, only add the two properties to it.

   ```json
   "configuration": {
     "title": "bigUML",
     "properties": {
       "bigUML.timeline.onSave": {
         "type": "boolean",
         "default": false,
         "description": "Create a new timeline entry on file save."
       },
       "bigUML.timeline.persistent": {
         "type": "boolean",
         "default": false,
         "description": "Persist timeline entries across restarts."
       }
     }
   }
   ```

4. Run `pnpm typecheck`, `pnpm lint` and `pnpm build`, then launch the extension.

## Notes

- The package still compiles, but it has not been tested against the reworked UML language since it was
  disabled. Check that snapshots are taken on save and can be imported and exported.
- See [README.md](README.md) for the feature itself.
