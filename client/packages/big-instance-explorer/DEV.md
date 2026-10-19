# big-instance-explorer — Development Notes

The Instance Explorer (the Instances view: browse and edit instances and links, test data generation and template
based export) is **disabled**. The package is not activated, and its view and command are hidden. Its webview is
still built and its export `templates/` are still copied by `application/vscode/esbuild.ts`.

The object diagram support it builds on — `InstanceSpecification.classifier`, the `InstanceLink` edge and the UML
object notation — is part of the UML language and stays enabled.

## Enable the feature

All paths are relative to `client/`.

1. **Extension** – `application/vscode/src/extension.config.ts`: uncomment the
   `import { instanceExplorerModule } from '@borkdominik-biguml/big-instance-explorer/vscode';` import and the
   `instanceExplorerModule(VSCodeSettings.instanceExplorer.viewType)` entry in `container.load(...)`.
2. **GLSP server** – `application/vscode/src/server.main.ts`: uncomment the
   `import { instanceExplorerGlspModule } from '@borkdominik-biguml/big-instance-explorer/glsp-server';` import and
   add `instanceExplorerGlspModule` to the module list passed to `startGLSPServer(...)`.
3. **GLSP client** – `packages/uml-glsp-client/src/env/browser/webview/uml-starter.ts`: uncomment the
   `import { instanceExplorerModule } from '@borkdominik-biguml/big-instance-explorer/glsp-client';` import and the
   `instanceExplorerModule` entry in `createUmlDiagramContainer(...)`.
4. **Contributions** – `application/vscode/package.json`:
   - `contributes.views["bigUML-panel"]`: set `"when"` of `bigUML.panel.instance-explorer` to `"bigUML.isRunning"`.
   - `contributes.menus.commandPalette`: remove the `"when": "false"` entry of `bigUML.exportInstances`.
5. Run `pnpm typecheck`, `pnpm lint`, `pnpm test` and `pnpm build`, then launch the extension.

## Notes

- The package was written against an older bigUML and ported to the current one: elements are created with inline
  `bounds` and type-prefixed ids. The unit tests pass, but the views have not been tested in the running extension
  since the port. Check creating, editing and linking instances, test data generation and export, e.g. with
  `workspace/hr_system/hr_system.uml`.
- **Not ported:** the property palette offered a slot only the properties of its instance's classifier (and its
  superclasses) as defining feature. This needs a hook in the property palette generator
  (`packages/big-property-palette/generator`) for choices that depend on the element; currently every property of
  the model is offered.
- **Removed tests:** the end-to-end test (generate → patch → serialize → parse) and the grammar-safety test were
  written against the old patch pipeline and the old `LANGIUM_ID` terminal. An end-to-end test against the current
  model server patch applier is still missing.
- Value sanitizing (`sanitizeSlotValue`) dates from the `LANGIUM_ID` terminal. Slot values are JSON strings now, so
  most of it is likely unnecessary; check `UmlDiagramTokenBuilder` (quoted enum keywords) before removing it.
- See [README.md](README.md) and [docs/](docs/) for the feature itself.
