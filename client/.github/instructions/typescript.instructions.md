---
name: 'Typescript Standards'
description: 'Coding conventions and architecture rules for TypeScript files'
applyTo: '**/*.ts,**/*.tsx'
---

# TypeScript coding standards

- Use `import type { ... }` for type-only imports (`@typescript-eslint/consistent-type-imports`).
- Use `import` for value imports.
- Always use `export * from` syntax for re-exports in barrel index files.
- Include file extensions in all relative imports, e.g., `import { Foo } from './foo.js'` (`n/file-extension-in-import`).
- Every source file must start with the copyright header:

```typescript
/**********************************************************************************
 * Copyright (c) <CURRENT_YEAR> borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
```

# InversifyJS dependency injection

- Use `@injectable()` on every class that is bound in a DI container.
- Use `@inject(SYMBOL)` for constructor or property injection.
- Use `@postConstruct()` for initialization logic after injection.
- Use `@multiInject(SYMBOL)` when collecting multiple implementations of a binding.
- DI symbols live in `packages/<package>/src/env/vscode/<package>.types.ts` (exported as `TYPES`).
    - e.g., `packages/big-vscode/src/env/vscode/vscode-common.types.ts`

# Environment boundaries

Each package splits source into `src/env/<environment>/` folders. Respect these boundaries:

- `src/env/common/` - Shared types, actions, protocols. No Node.js or browser-specific APIs.
- `src/env/vscode/` - Extension host code. Can import `vscode` and Node.js APIs. Bound in `extension.config.ts`.
- `src/env/glsp-server/` - GLSP server code. Can import `@eclipse-glsp/server`. Registered in `server.main.ts`.
- `src/env/glsp-client/` - Browser-side GLSP client. Can import `@eclipse-glsp/client`. No Node.js APIs.
- `src/env/browser/` - React webview components. Can import `react`, `@vscode/webview-ui-toolkit`. No Node.js APIs.
- `src/env/jsx/` - Custom JSX runtime for GModel construction.

Never import across environment boundaries (e.g., never import `vscode` in `glsp-server/` code).

## Generated code

- Files in `src/gen/` are machine-generated from `tooling/uml-language/src/language/def.ts`. Never edit them manually.
- Regenerate with `npm run generate`.
- Each package with generated code has a `generator/` directory containing `contribution.ts` and Eta templates.

## Documentation

Read only when you need deeper context:

- `docs/architecture-overview.md` - System-wide architecture, startup sequence, environment model, package layers
