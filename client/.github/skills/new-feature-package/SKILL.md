---
name: new-feature-package
description: >-
    Create a new feature package in the bigUML monorepo with proper environment folders,
    DI modules, exports map, and registration. Use this skill whenever the user wants to
    create a new package, add a new feature, scaffold a package, set up a new module,
    or mentions "new package", "feature package", "create package", "add feature",
    "scaffold", or "monorepo package". Also use when the user needs to understand
    the package structure or environment folder conventions.
---

# Create a New Feature Package

Guide for scaffolding a new feature package in the bigUML pnpm monorepo. Feature packages follow an environment-based folder convention that lets them contribute code to multiple runtime processes (extension host, GLSP server, browser webview) from a single package.

## Task checklist

- Create the package directory under `packages/`
- Set up `package.json` with name, dependencies, and exports map
- Create environment folders (`src/env/common/`, plus others as needed)
- Create index files for each environment
- Implement `VscodeFeatureModule` (if the package has extension host code)
- Implement `DiagramFeatureModule` (if the package has GLSP server code)
- Register modules in `application/vscode/src/extension.config.ts` and/or `application/vscode/src/server.main.ts`
- Register the webview entry point in `application/vscode/esbuild.ts` (if the package has a browser webview)
- Run `pnpm install` to link the package into the workspace

## Before you start

Study an existing feature package as a template. `packages/big-outline/` is a good minimal example. `packages/big-property-palette/` is a comprehensive example with all environments.

Read `docs/architecture-overview.md` for the full environment model and package layer diagram.

## Step 1: Create the package directory

```
packages/big-<name>/
├── package.json
├── src/
│   └── env/
│       ├── common/
│       │   └── index.ts
│       ├── vscode/              # if contributing to extension host
│       │   └── index.ts
│       ├── glsp-server/         # if contributing to GLSP server
│       │   └── index.ts
│       ├── glsp-client/         # if contributing to GLSP client
│       │   └── index.ts
│       └── browser/             # if providing a webview UI
│           └── index.ts
```

Packages have no `tsconfig.json`, build script or `esbuild.ts`. Type checking is done by the root projects in `configs/ts/` (they pick up `packages/*/src/env/*` automatically), and `application/vscode/esbuild.ts` bundles everything.

Only create the environment folders that are actually needed. Every package should have `common/` at minimum.

## Step 2: Set up package.json

Use this template, adjusting the exports map to include only the environments your package uses:

```json
{
    "name": "@borkdominik-biguml/big-<name>",
    "version": "0.0.0",
    "private": true,
    "type": "module",
    "exports": {
        ".": "./src/env/common/index.ts",
        "./vscode": "./src/env/vscode/index.ts",
        "./glsp-server": "./src/env/glsp-server/index.ts",
        "./glsp-client": "./src/env/glsp-client/index.ts"
    },
    "dependencies": {
        "@borkdominik-biguml/big-vscode": "workspace:*",
        "@borkdominik-biguml/big-common": "workspace:*"
    }
}
```

The exports point at the TypeScript sources; there is nothing to build. Use `workspace:*` for workspace packages and `catalog:` for dependencies that have a version in the `catalog` of `pnpm-workspace.yaml`. Declare every package you import - pnpm does not hoist undeclared dependencies.

Add dependencies based on which environments the package targets:

- **vscode env**: `@borkdominik-biguml/big-vscode`, `inversify`, `vscode`
- **glsp-server env**: `@borkdominik-biguml/uml-glsp-server`, `@eclipse-glsp/server`
- **glsp-client env**: `@eclipse-glsp/client`
- **browser env**: `@borkdominik-biguml/big-components`, `react`, `react-dom`

## Step 3: Type checking

Nothing to set up. `configs/ts/node.project.json` includes `packages/*/src/env/{common,vscode,glsp-server,jsx}` and `configs/ts/browser.project.json` includes `packages/*/src/env/{browser,glsp-client}`. Run `pnpm check` (or keep `pnpm dev` running) to type check and lint.

If the package has a webview, add its entry point to the `webviews` map in `application/vscode/esbuild.ts`. The key is the folder below `application/vscode/webviews/` that the webview provider loads its `bundle.js`/`bundle.css` from.

## Step 4: Create the common environment

`src/env/common/index.ts` exports shared types - actions, models, protocol definitions:

```typescript
// Export action types, models, and protocol shared across environments
export * from './my-feature.action.js';
export * from './my-feature.model.js';
```

## Step 5: Create the VSCode module (extension host)

If the package contributes to the extension host, create `src/env/vscode/my-feature.module.ts`:

```typescript
import { VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';

export function myFeatureModule(viewType: string) {
    return new VscodeFeatureModule(context => {
        // Bind services, commands, webview factories here
    });
}
```

Export from `src/env/vscode/index.ts`:

```typescript
export * from './my-feature.module.js';
```

Register in `application/vscode/src/extension.config.ts`:

```typescript
import { myFeatureModule } from '@borkdominik-biguml/big-<name>/vscode';

// Inside createContainer():
container.load(
    myFeatureModule(VSCodeSettings.myFeature.viewType)
    // ...existing modules
);
```

## Step 6: Create the GLSP server module

If the package contributes action or operation handlers, create `src/env/glsp-server/my-feature.module.ts`:

```typescript
import { DiagramFeatureModule } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { ActionHandlerConstructor, InstanceMultiBinding } from '@eclipse-glsp/server';
import { MyFeatureActionHandler } from './my-feature.action-handler.js';

class MyFeatureDiagramFeatureModule extends DiagramFeatureModule {
    override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        binding.add(MyFeatureActionHandler);
    }
}

export const myFeatureGlspModule = new MyFeatureDiagramFeatureModule();
```

Register in `application/vscode/src/server.main.ts`:

```typescript
import { myFeatureGlspModule } from '@borkdominik-biguml/big-<name>/glsp-server';

startGLSPServer({ shared, language: UmlDiagram }, [propertyPaletteModule, outlineModule, advancedSearchGlspModule, myFeatureGlspModule]);
```

## Step 7: Link the package

`pnpm-workspace.yaml` already includes `packages/*`. Run `pnpm install` from the workspace root to link the new package, and add it with `workspace:*` to the packages (e.g. `application/vscode`) that use it.

## Common mistakes

- Importing from the wrong environment (e.g., importing `vscode` APIs in browser code, or `sprotty` directly instead of `@eclipse-glsp/client`)
- Forgetting to add the export to `package.json` exports map - consumers will get "module not found" errors
- Sharing DI container instances across processes - each process has its own container
- Missing `"type": "module"` in `package.json` - causes ESM/CJS interop issues

## Further reading

- `docs/architecture-overview.md` — environment model, startup sequence, package layers
- `docs/guides/glsp-server-feature-modules.md` — how feature modules plug into the GLSP server
- `docs/guides/webview-registration.md` — if your package includes a webview
