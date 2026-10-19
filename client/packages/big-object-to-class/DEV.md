# big-object-to-class — Development Notes

The Object to Class transformation (the Object to Class Preview view, which infers a class diagram from instance
data) is **disabled**. The package is not activated, and its view is hidden. Its webview is still built by
`application/vscode/esbuild.ts`.

## Enable the feature

All paths are relative to `client/`.

1. **Extension** – `application/vscode/src/extension.config.ts`: uncomment the
   `import { transformationPreviewModule } from '@borkdominik-biguml/big-object-to-class/vscode';` import and the
   `transformationPreviewModule(VSCodeSettings.objectToClass.viewType)` entry in `container.load(...)`.
2. **GLSP server** – `application/vscode/src/server.main.ts`: uncomment the
   `import { transformationModule } from '@borkdominik-biguml/big-object-to-class/glsp-server';` import and add
   `transformationModule` to the module list passed to `startGLSPServer(...)`.
3. **GLSP client** – `packages/uml-glsp-client/src/env/browser/webview/uml-starter.ts`: uncomment the
   `import { transformationModule } from '@borkdominik-biguml/big-object-to-class/glsp-client';` import and the
   `transformationModule` entry in `createUmlDiagramContainer(...)`.
4. **Contributions** – `application/vscode/package.json`: in `contributes.views["bigUML-panel"]`, set `"when"` of
   `bigUML.panel.object-to-class` to `"bigUML.isRunning"`.
5. Run `pnpm typecheck`, `pnpm lint` and `pnpm build`, then launch the extension.

## Notes

- The package was written against an older bigUML and ported to the current one: `buildPatches`
  (`src/env/common/patch-builder.ts`) now writes the current model format (inline `bounds`, type-prefixed ids,
  `ref` references). It has no tests and has not been tested in the running extension since the port. Apply a
  transformation and check that the created classes, associations, instances and links open without errors.
- The inferred properties are created without a type.
