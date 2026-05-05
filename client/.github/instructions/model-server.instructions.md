---
name: 'Model Server'
description: 'Conventions for the Langium-based model server'
applyTo: 'packages/uml-model-server/**'
---

# Model server conventions

This package provides the Langium language server and the JSON-RPC model server. It runs in the server child process alongside the GLSP server.

## Two server roles

1. **Language Server (LSP)** - Provides textual editing features (validation, completion, formatting) for `.uml` files via the Language Server Protocol.
2. **Model Server (JSON-RPC, port 5999)** - Exposes the Langium AST to non-LSP clients (primarily the GLSP server) for structured mutations.

## Langium service architecture

- Services are assembled in `src/env/langium/uml-diagram-module.ts` via `createUmlDiagramServices()`.
- **Shared services** = Langium defaults + generated shared module + `UmlDiagramSharedModule`.
- **Language services** = Langium defaults + generated language module + `createUmlDiagramModule()`.
- Custom overrides include: scoping (`UmlDiagramScopeProvider`), serialization (`UmlDiagramJsonSerializer`), validation (`UmlDiagramValidator`), naming (`UmlDiagramNaming`).

## JSON patch & undo/redo

- `PatchManager` applies RFC 6902 patches to the AST.
- It rebuilds cross-references after patching and records undo/redo snapshots.
- Undo/redo uses a doubly-linked list storing full document text before and after each patch.

## Multi-client coordination

- `OpenTextDocumentManager` tracks separate version numbers for `"text"` (LSP editor) and `"glsp"` (diagram editor).
- When text version > glsp version, GLSP clients are notified of the change.
- When glsp version > text version, the text editor content is replaced.

## Generated code

- The Langium grammar (`src/gen/langium/uml-diagram.langium`) is generated from `def.ts`.
- The serializer (`src/gen/langium/uml-diagram-serializer.ts`) is generated per element type.
- Validation DTOs are generated from decorator annotations.
- After editing `def.ts`, run `npm run generate` to regenerate all output including the Langium AST types.

## Documentation

Read only when you need deeper context:

- `docs/model-server.md` - Complete model server architecture, RPC protocol, multi-client coordination, undo/redo
