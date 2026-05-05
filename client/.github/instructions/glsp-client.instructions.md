---
name: 'GLSP Client'
description: 'Conventions for the browser-side GLSP client and diagram rendering'
applyTo: 'packages/uml-glsp-client/**,**/env/glsp-client/**,**/env/browser/**'
---

# GLSP client conventions

This code runs in the **browser webview**. No Node.js APIs (`fs`, `path`, `child_process`, `vscode`) are available.

## Import rules

- Import from `@eclipse-glsp/client`, never from `sprotty` or `sprotty-protocol` directly.

## Element rendering

- Each UML element type has a `.element.tsx` file in `src/env/browser/uml/elements/`.
- Element files define Sprotty views (SVG rendering) for diagram nodes and edges.
- Use GLSP's `GNodeView`, `GEdgeView`, and related view classes as base classes.
- Register views in the GLSP client container module.

## React webviews

- Webview root components live in `src/env/browser/` of their respective packages.
- Use `VSCodeConnector` from `@borkdominik-biguml/big-components` to initialize messaging.
- Use `BigMessenger` for typed RPC communication with the extension host.
- Bundle with esbuild → output to `application/vscode/webviews/<name>/`.

## Container setup

- The GLSP client DI container is created by `createUmlDiagramContainer()` in `packages/uml-glsp-client/src/env/browser/uml-glsp.module.ts`.
- Feature packages contribute modules from their `./glsp-client` export.

## Documentation

Read only when you need deeper context:

- `docs/guides/webview-registration.md` - Webview messaging, bundling, and lifecycle
