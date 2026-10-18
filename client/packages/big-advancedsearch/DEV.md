# big-advancedsearch — Development Notes

Advanced Search and Replace is **disabled** (since "Improve UML language", #224). The package is not activated,
and its view and commands are hidden. Its webview is still built by `application/vscode/esbuild.ts`.

## Enable the feature

All paths are relative to `client/`.

1. **Extension** – `application/vscode/src/extension.config.ts`: uncomment the
   `import { advancedSearchModule } from '@borkdominik-biguml/big-advancedsearch/vscode';` import and the
   `advancedSearchModule(VSCodeSettings.advancedSearch.viewType)` entry in `container.load(...)`.
2. **GLSP server** – `application/vscode/src/server.main.ts`: uncomment the
   `import { advancedSearchGlspModule } from '@borkdominik-biguml/big-advancedsearch/glsp-server';` import and
   add `advancedSearchGlspModule` to the module list passed to `startGLSPServer(...)`.
3. **GLSP client** – `packages/uml-glsp-client/src/env/browser/webview/uml-starter.ts`: uncomment the
   `import { advancedSearchModule } from '@borkdominik-biguml/big-advancedsearch/glsp-client';` import and the
   `advancedSearchModule` entry in `createUmlDiagramContainer(...)`.
4. **Contributions** – `application/vscode/package.json`:
   - `contributes.views["bigUML-panel"]`: set `"when"` of `bigUML.panel.advancedsearch` to `"bigUML.isRunning"`.
   - `contributes.menus.commandPalette`: remove the `"when": "false"` entries of
     `bigUML.advancedsearch.toggleSyntax`, `bigUML.advancedsearch.enablePreviews` and
     `bigUML.advancedsearch.disablePreviews`.
5. Run `pnpm typecheck`, `pnpm lint`, `pnpm test` and `pnpm build`, then launch the extension.

## Notes

- The package still compiles, but it has not been tested against the reworked UML language since it was
  disabled. Check that search and replace work on all diagram types.
- See [SUBMISSION_README.md](SUBMISSION_README.md) and
  [SUBMISSION_README_SEARCH_AND_REPLACE.md](SUBMISSION_README_SEARCH_AND_REPLACE.md) for the feature itself.
