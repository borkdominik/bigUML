---
name: 'GLSP Server'
description: 'Architecture rules for the GLSP diagram server package'
applyTo: 'packages/uml-glsp-server/**'
---

# GLSP server conventions

This package runs in the server child process (Node.js), not in the browser or extension host.

## Operation handlers

- All model mutations use the generic operation handler pattern. Do not create per-element-type handlers.
- `GenericCreateNodeOperationHandler`, `GenericCreateEdgeOperationHandler`, `GenericDeleteOperationHandler`, `GenericUpdateOperationHandler`, `GenericChangeBoundsOperationHandler`, and `GenericLabelEditOperationHandler` handle all UML element types using generated metadata.
- Handlers produce `ModelPatchCommand` instances containing JSON patch arrays. They never modify the AST directly.
- Use `DiagramModelIndex.findPath(id)` to get the JSON path for an element.
- Use `getCreationPath(parentType, childType)` (generated) to find the property name for adding children.
- Use `getDefaultValue(type)` (generated) to get default property values for new elements.

## JSON patch flow

1. Handler looks up element via `DiagramModelIndex` → gets JSON path.
2. Handler builds a JSON patch array (`[{op, path, value}]`).
3. Handler returns `new ModelPatchCommand(state, JSON.stringify(patches))`.
4. Server executes the command → `DiagramModelState.sendModelPatch()` → model server applies patch.
5. `GModelFactory.createModel()` rebuilds the GModel from the updated semantic root.

## JSX GModel construction

- Element files use the custom JSX runtime (`src/env/jsx/jsx-runtime.ts`) to build `GModelElement` trees.
- Element files are named `*.element.tsx` and live in `src/env/vscode/elements/`.
- Shared JSX components (`CompartmentHeader`, `SectionCompartment`, `InlineCompartment`, `DividerElement`) live in `src/env/vscode/elements/shared-components.tsx`.
- The JSX runtime produces standard `GModelElement` instances - no React dependency.
- Each `.element.tsx` file typically declares a `GNode` subclass and a factory function.

## DI modules

- `UmlDiagramModule` extends `BigDiagramModule` which extends GLSP's `DiagramModule`.
- Feature packages register handlers via `DiagramFeatureModule` - use `configureActionHandlers()` and `configureOperationHandlers()` hooks.
- Register new `DiagramFeatureModule` instances in `server.main.ts` by passing them to `startGLSPServer()`.

## Key types

- `DiagramModelState` - holds the semantic root (`Diagram` AST) and provides `sendModelPatch()`, `undo()`, `redo()`.
- `DiagramModelIndex` - maps element IDs to JSON paths and semantic AST nodes.
- `UmlDiagramGModelFactory` - converts the semantic AST to a `GGraph` using JSX.
- `ModelPatchCommand` - wraps a JSON patch string for execution with undo/redo.

## Documentation

Read only when you need deeper context:

- `docs/glsp-server-architecture.md` - Complete GLSP server architecture, GModel creation, JSON patch flow
- `docs/guides/glsp-server-feature-modules.md` - How feature packages extend the GLSP server
