<!--
 Copyright (c) 2026 borkdominik and others.
 This program and the accompanying materials are made available under the
 terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 SPDX-License-Identifier: MIT
-->

# Automatic Test Data Generation

Generates `InstanceSpecification`s with classifier-consistent slot values and
`InstanceLink`s for a class diagram, applied as one atomic, undoable model change. Built
on top of the Model Instance Explorer and reachable from the **Instances** panel via
**Generate Test Data**.

This document covers the package internals for developers. For usage, configuration
options, pattern syntax, and diagnostics, see the
[Test Data Generation Reference](test-data-generation.md).

## Architecture

The feature is split into a pure functional core, which is unit-tested, and a thin GLSP
imperative shell, which is verified by running the extension.

| File | Role |
|---|---|
| `src/env/common/generate.action.ts` | `GenerateInstancesOperation`, `RequestGenerateInstancesPreviewAction`, and the `GenerationConfig` contract |
| `src/env/glsp-server/generate.handler.ts` | Resolves the Langium AST into plain views, builds one `ModelPatchCommand`, serves the preview and the classifier listing |
| `src/env/glsp-server/generate.core.ts` | `buildGeneration` produces instances, slots, and diagnostics as one JSON patch array; `sanitizeSlotValue` |
| `src/env/glsp-server/links.core.ts` | `planLinks` plans links under both-end multiplicity with balanced, least-used-first target selection |
| `src/env/glsp-server/expand.core.ts` | `expandClassifierSelection` expands the selection transitively over the classifier and association graph |
| `src/env/glsp-server/resolve.ts` | Multiplicity parsing and property type resolution |
| `src/env/glsp-server/strategies/` | `ValueStrategy` implementations: random, pattern, realistic, plus the seeded RNG |
| `src/env/common/pattern-suggest.ts` | Suggested default patterns for the pattern editor |
| `src/env/browser/generate-dialog.component.tsx` | The configuration form in the Instances panel |

Design notes:

- The core works on plain resolved views of classifiers and properties, not on the live
  AST, so it needs no GLSP, dependency injection, or IO and is exhaustively
  unit-testable.
- The apply path is a GLSP `Operation`. All instances, slots, positions, and links are
  concatenated into **one** `ModelPatchCommand`, the only path that yields single-undo
  atomicity. The preview action runs the same core in memory and mutates nothing.
- Every value from every strategy passes through `sanitizeSlotValue` before it becomes
  a `LiteralSpecification`. The grammar stores slot values as `LANGIUM_ID` tokens, so
  whitespace becomes `_` and bare numbers and booleans receive a `_` prefix, stored as
  `_63` and `_true`. Verbatim storage needs an escaped-string grammar terminal, which
  is tracked as metamodel work.
- All randomness flows through a seedable RNG, so identical seed and configuration
  reproduce identical output, and tests can assert exact values.

## Tests

```bash
npm test
```

Tests live in `test/` and run on Node's built-in test runner via `tsx`. The pure core
is covered by unit tests per module. `test/generate.e2e.test.ts` drives the real
model-server patch pipeline, applying the patch, serializing, and re-parsing, against
the committed typed fixture `test/fixtures/library-domain.uml`. It asserts type-correct
generation, zero-parse-error round trips, constraint handling, link bounds, and
single-undo reversibility. `test/grammar-safety.test.ts` pins that every generated id
is a valid, never digit-leading `LANGIUM_ID`.

## Known limitations

- An LLM strategy following the reference paper *LLM-based Generation of Semantically
  Diverse and Realistic Domain Model Instances* by Coman, Burgueño, Bork, and Wimmer is
  planned but not implemented; the `ValueStrategy` interface is its plug-in point.
- Whitespace and bare numeric or boolean values are stored transformed, see above.
- Generated nodes are laid out in a grid below the existing diagram; links are not
  auto-routed.
