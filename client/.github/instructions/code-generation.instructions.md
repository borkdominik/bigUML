---
name: 'Code Generation'
description: 'Rules for generated code and the generation pipeline'
applyTo: '**/generator/**,**/src/gen/**'
---

# Code generation rules

## Never edit generated files

Files under `src/gen/` are machine-generated from `tooling/uml-language/src/language/def.ts`. **Never edit them manually** - changes will be overwritten on the next `npm run generate`.

## How to make changes

1. Modify the language definition: `tooling/uml-language/src/language/def.ts`.
2. Or modify the generator templates: `<package>/generator/` directory (Eta templates + `contribution.ts`).
3. Run `npm run generate` from the workspace root to regenerate all packages.

## Generation pipeline

1. The `uml-language-tooling` CLI parses `def.ts` using the TypeScript compiler API → `Declaration[]`.
2. Transforms declarations: flatten inheritance, resolve types → `LangiumDeclaration[]`.
3. Validates declaration consistency.
4. Dynamically loads each package's `generator/contribution.ts` and calls `umlToolingContribution(extensionPath, declarations)`.
5. Renders Eta templates and writes output files to `src/gen/`.

## Per-package generators

| Package                | Generates                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `uml-glsp-server`      | Model type constants, tool palette items, creation paths, default values, language metadata |
| `big-property-palette` | Per-element property palette handlers (JSX), request dispatcher                             |
| `uml-model-server`     | Langium grammar (`.langium`), AST serializer, validation DTOs                               |

## Adding a new UML element

1. Add a class to `def.ts` with appropriate decorators.
2. Run `npm run generate`.
3. The pipeline auto-generates: model types, tool palette entry, creation path, default values, property palette handler, grammar rule, and serializer method.

## Documentation

Read only when you need deeper context:

- `docs/guides/property-palette-generator.md` - Full pipeline walkthrough using the property palette as example
