# big-code-generation — Development Notes

Code generation is **disabled** (since "Improve UML language", #224). The package is not activated, and its view
is hidden. Its webview is still built and its `templates/` are still copied by `application/vscode/esbuild.ts`.

## Enable the feature

All paths are relative to `client/`.

1. **Extension** – `application/vscode/src/extension.config.ts`: uncomment the
   `import { codeGenerationModule } from '@borkdominik-biguml/big-code-generation/vscode';` import and the
   `codeGenerationModule(VSCodeSettings.codeGeneration.viewType)` entry in `container.load(...)`.
2. **GLSP client** – `packages/uml-glsp-client/src/env/browser/webview/uml-starter.ts`: uncomment the
   `import { codeGenerationModule } from '@borkdominik-biguml/big-code-generation/glsp-client';` import and the
   `codeGenerationModule` entry in `createUmlDiagramContainer(...)`.
3. **Contributions** – `application/vscode/package.json`: in `contributes.views["bigUML-panel"]`, set `"when"` of
   `bigUML.panel.code-generation` to `"bigUML.isRunning"`.
4. Run `pnpm typecheck`, `pnpm lint` and `pnpm build`, then launch the extension.

## Notes

- The package still compiles, but it has not been tested against the reworked UML language since it was
  disabled. Check the generated Java and TypeScript code for class diagrams.
- See [README.md](README.md) for the feature itself.
