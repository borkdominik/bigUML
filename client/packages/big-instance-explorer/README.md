# Big Instance Explorer

The Big Instance Explorer adds an **Instances** webview to the bigUML VS Code extension.
It lets users inspect and edit UML object diagram data from a tree-oriented side panel instead of working only through the diagram canvas.

This document summarizes the feature work in the instance explorer branch.
It intentionally focuses on the extension changes and does not treat presentation artifacts or merges from `main` as product changes.

## Feature Overview

The explorer groups `InstanceSpecification` elements by their classifier and keeps instances without a resolved classifier in an `Unclassified` section.
Each group can be expanded to inspect individual instances, slots, links, and validation diagnostics.

Implemented user-facing behavior includes:

- Browse instances grouped by classifier, with a separate section for unclassified instances.
- Filter the tree by classifier name, instance name, slot name, slot value, diagnostic text, relation name, or linked instance.
- Select an instance from the explorer, center it in the active diagram, and clear the selection with `Escape`.
- Delete the selected instance from the explorer with `Delete`.
- Rename instances and classifiers inline.
- Edit slot values inline; comma-separated or line-separated input is stored as slot literal values.
- Create new instances for instantiable classifiers, including classifiers that do not yet have any instances.
- Create and edit `InstanceLink` relations for 1-to-1, 1-to-N, and many-to-many associations.
- Change relation endpoints through dropdowns that only contain eligible instances.
- Show warnings for missing classifiers, missing slots for classifier properties, invalid slot defining features, and multiplicity mismatches.

The branch also adds example UML models that help exercise the explorer:

- `client/workspace/hr_system_empty/hr_system_empty.uml`
- `client/workspace/hr_system_errors/hr_system_errors.uml`

## Implementation Overview

The package is split by runtime environment:

- `src/env/browser/instance-explorer.component.tsx` renders the React webview UI and dispatches explorer operations.
- `src/env/browser/webview/instance-explorer.webview.tsx` mounts the React app inside the VS Code webview.
- `src/env/common/instance-explorer.action.ts` defines request, response, and operation contracts shared by the client and server.
- `src/env/vscode/instance-explorer.webview-view-provider.ts` wires the VS Code webview to the active GLSP client and refreshes cached explorer data when the model state changes.
- `src/env/glsp-client/instance-explorer.module.ts` registers the explorer response action as a GLSP client extension action.
- `src/env/glsp-server/instance-explorer.handler.ts` builds explorer data from the semantic model and applies model-changing operations through `ModelPatchCommand`.
- `src/env/glsp-server/instance-explorer.module.ts` registers the explorer action handler and operation handlers on the GLSP server.
- `styles/index.css` contains the webview styling for the tree, inline editors, link pickers, diagnostics, and selected states.

The VS Code extension registers the package through `instanceExplorerModule(VSCodeSettings.instanceExplorer.viewType)`.
The contributed view id is `bigUML.panel.instance-explorer`, and the webview assets are bundled into `client/application/vscode/webviews/instance-explorer`.

## Development Guidelines

Keep shared protocol definitions in `src/env/common`.
When adding new data to the explorer, update the response interfaces, action creators, server response builder, and React rendering together so client and server stay in sync.

Keep model mutations behind GLSP operations.
The React component should dispatch typed operations, while server-side operation handlers should validate semantic elements and apply changes with `ModelPatchCommand`.

Register every new server operation in `src/env/glsp-server/instance-explorer.module.ts`.
If a new response or action kind must cross the GLSP boundary, register it in the GLSP client module as well.

Use the existing VS Code integration path.
The package should remain wired through the VS Code module and `VSCodeSettings.instanceExplorer.viewType` instead of hardcoding a second view id or provider path.

Update filtering, diagnostics, and eligibility logic together.
If a new displayed field can be searched, add it to the filter helpers.
If new model data can become invalid, expose a diagnostic rather than silently hiding the problem.

Preserve classifier and multiplicity checks when creating or editing links.
Eligible source and target lists should be derived from classifier compatibility, inheritance, existing link counts, and association multiplicities.

Keep many-to-many associations in the dedicated relation section.
1-to-1 and 1-to-N links are shown under the involved instances, while many-to-many links are grouped by relation to avoid duplicating dense relation data inside every instance.

When changing generated webview output, update the source and bundling configuration rather than editing generated assets directly.
The package bundle is produced by `esbuild.ts` and copied to the VS Code application webview folder.

## Useful Commands

Run these from `client` for workspace-wide development:

```bash
npm run setup
npm run build
npm run watch
npm run lint
```

Run these from `client/packages/big-instance-explorer` when working only on this package:

```bash
npm run build
npm run compile
npm run bundle
npm run lint
```

## Suggested Manual Checks

After changing the explorer, build the package and open a UML diagram in the VS Code extension.
Use the HR system example models to check empty diagrams, invalid instance data, classifier grouping, slot editing, relation creation, endpoint changes, filtering, selection, centering, and deletion.

For relation changes, verify all supported association shapes:

- 1-to-1 links can be created and retargeted only while both ends remain eligible.
- 1-to-N links respect the limited end and still allow valid additional peers.
- Many-to-many links appear in the relation section and can be edited through source and target dropdowns.
