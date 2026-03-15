---
name: new-webview
description: >-
    Add a new webview to bigUML - sidebar panel, bottom panel, or custom editor.
    Covers provider class, DI registration, React entry point, messaging, and esbuild
    bundling. Use this skill whenever the user wants to add a webview, create a sidebar,
    add a panel, build a custom editor, mentions "webview", "sidebar view", "panel",
    "WebviewViewProvider", "WebviewEditorProvider", or needs to set up messaging between
    extension host and a webview. Also use when the user wants to understand
    the webview architecture or fix webview messaging issues.
---

# Add a New Webview

Guide for adding a webview to bigUML. There are two variants - **view webviews** (sidebar/panel) and **editor webviews** (custom editors bound to a file type). Both build on `BaseWebviewProvider` which handles HTML generation, messaging, and lifecycle.

## Task checklist

- Choose webview type: `WebviewViewProvider` (sidebar/panel) or `WebviewEditorProvider` (custom editor)
- Create the provider class extending the appropriate base
- Create the VSCode feature module with `bindWebviewViewFactory` or `bindWebviewEditorFactory`
- Register the module in `application/vscode/src/extension.config.ts`
- Create the browser entry point (React component + `VSCodeConnector`)
- Set up esbuild bundling to `application/vscode/webviews/<name>/`
- Add `contributes.viewsContainers` and `contributes.views` entries in `application/vscode/package.json`
- Set up messaging if the webview needs to communicate with the extension host or GLSP server

## Before you start

Read existing webview implementations as templates:

- **Sidebar view**: `packages/big-property-palette/` (representative example)
- **Custom editor**: `packages/uml-glsp-client/` (diagram editor)

For full architecture details, read `docs/guides/webview-registration.md`.

## Step 1: Choose the webview type

| Type          | Base class              | Use case                                             | Registration                               |
| ------------- | ----------------------- | ---------------------------------------------------- | ------------------------------------------ |
| Sidebar/Panel | `WebviewViewProvider`   | Auxiliary views (property palette, outline, minimap) | `contributes.views` in a `viewsContainers` |
| Custom Editor | `WebviewEditorProvider` | File-bound editors (diagram editor)                  | `contributes.customEditors`                |

Most features use sidebar views. Custom editors are only for file-type-specific editors.

## Step 2: Create the provider class

For a sidebar/panel view, extend `WebviewViewProvider`:

```typescript
// packages/big-<name>/src/env/vscode/my-feature.webview-view-provider.ts

import { ActionListener, BigGlspVSCodeConnector, type WebviewMessenger, WebviewViewProvider } from '@borkdominik-biguml/big-vscode/vscode';
import { inject, injectable } from 'inversify';
import type { Disposable } from 'vscode';

@injectable()
export class MyFeatureWebviewViewProvider extends WebviewViewProvider {
    override viewId = 'bigUML.myFeature';

    constructor(
        @inject(BigGlspVSCodeConnector) readonly connector: BigGlspVSCodeConnector,
        @inject(ActionListener) readonly actionListener: ActionListener
    ) {
        super();
    }

    protected override resolveWebviewProtocol(messenger: WebviewMessenger): Disposable {
        const toDispose: Disposable[] = [];
        // Register custom message handlers here
        return { dispose: () => toDispose.forEach(d => d.dispose()) };
    }

    protected override handleOnReady(): void {
        // Called when the webview signals it's ready
        // Dispatch initial data to the webview here
    }
}
```

Key lifecycle hooks from `BaseWebviewProvider`:

- `resolveWebviewProtocol(messenger)` - register custom notification handlers
- `resolveActionProtocol(messenger)` - register GLSP action handlers (override if needed)
- `handleOnReady()` - webview is loaded and ready to receive messages
- `handleOnVisible()` - webview became visible
- `handleOnHide()` - webview was hidden

## Step 3: Create the VSCode feature module

```typescript
// packages/big-<name>/src/env/vscode/my-feature.module.ts

import { bindWebviewViewFactory, VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';
import { MyFeatureWebviewViewProvider } from './my-feature.webview-view-provider.js';

export function myFeatureModule(viewType: string) {
    return new VscodeFeatureModule(context => {
        bindWebviewViewFactory(context, {
            provider: MyFeatureWebviewViewProvider,
            options: { viewType }
        });
    });
}
```

`bindWebviewViewFactory` creates a child DI container for each webview instance, scoping `WebviewMessenger` and `ActionWebviewMessenger` per-webview.

## Step 4: Register in the extension config

In `application/vscode/src/extension.config.ts`:

```typescript
import { myFeatureModule } from '@borkdominik-biguml/big-<name>/vscode';

container.load(
    myFeatureModule(VSCodeSettings.myFeature.viewType)
    // ...existing modules
);
```

Add the view type constant to VSCode settings if not already present.

## Step 5: Create the browser entry point

The webview runs in an iframe with its own React app:

```typescript
// packages/big-<name>/src/env/browser/webview/my-feature.webview.tsx

import 'reflect-metadata';
import { VSCodeConnector } from '@borkdominik-biguml/big-components';
import { createRoot } from 'react-dom/client';
import { MyFeatureComponent } from '../my-feature.component.js';
import '../../../../styles/index.css';

const element = document.getElementById('root');
if (!element) throw new Error('Root element not found!');
const root = createRoot(element);
root.render(
    <VSCodeConnector>
        <MyFeatureComponent />
    </VSCodeConnector>
);
```

`VSCodeConnector` initializes the `vscode-messenger-webview`, signals readiness to the extension host, and provides a `VSCodeContext` for child components to send/receive messages.

## Step 6: Set up esbuild bundling

```typescript
// packages/big-<name>/esbuild.ts

import { copy } from 'esbuild-plugin-copy';
import { ESBuildRunner, reactConfig, rootConfig } from '../../esbuild.config.mjs';

const runner = new ESBuildRunner({
    ...rootConfig,
    ...reactConfig,
    outdir: 'dist',
    entryNames: 'bundle',
    entryPoints: ['./src/env/browser/webview/my-feature.webview.tsx'],
    tsconfig: './tsconfig.json',
    plugins: [
        copy({
            resolveFrom: 'cwd',
            assets: [
                {
                    from: ['dist/**/*'],
                    to: ['../../application/vscode/webviews/<name>']
                }
            ]
        })
    ]
});
runner.clear();
await runner.run();
```

The bundle output (`bundle.js` + `bundle.css`) is copied to `application/vscode/webviews/<name>/` where `ReactHtmlProvider` generates `<script>` and `<link>` tags to load them.

## Step 7: Declare in package.json

In `application/vscode/package.json`, add the view container and view:

```json
{
    "contributes": {
        "viewsContainers": {
            "activitybar": [
                {
                    "id": "bigUML",
                    "title": "bigUML",
                    "icon": "resources/icon.svg"
                }
            ]
        },
        "views": {
            "bigUML": [
                {
                    "type": "webview",
                    "id": "bigUML.myFeature",
                    "name": "My Feature"
                }
            ]
        }
    }
}
```

## Messaging patterns

### Extension host to Webview (GLSP actions)

Use `ActionWebviewMessenger` to dispatch GLSP actions:

```typescript
// In the provider
this.actionMessenger.dispatch(SetPropertyPaletteAction.create({ elementId, palette }));
```

### Webview to Extension host (custom notifications)

Define a notification type in `src/env/common/`:

```typescript
import { NotificationType } from 'vscode-messenger-common';

export const MyFeatureNotification = {
    refresh: { method: 'myFeature/refresh' } as NotificationType<void>
};
```

Register handler in the provider's `resolveWebviewProtocol()`:

```typescript
toDispose.push(
    messenger.onNotification(MyFeatureNotification.refresh, () => {
        this.refresh();
    })
);
```

Send from the browser component:

```typescript
const messenger = useContext(VSCodeContext).messenger;
messenger.sendNotification(MyFeatureNotification.refresh);
```

## Common mistakes

- Forgetting `reflect-metadata` import at the top of the webview entry point
- Missing the esbuild copy plugin - the bundle won't reach `application/vscode/webviews/`
- Using Node.js APIs in browser code (no `fs`, `path`, `child_process`, `vscode`)
- Not wrapping the React app in `<VSCodeConnector>` - messaging won't initialize

## Further reading

- `docs/guides/webview-registration.md` — complete architecture and examples
- `docs/architecture-overview.md` — where webviews fit in the overall system
