---
name: new-glsp-action
description: >-
    Add a new GLSP action with server-side handling and optional client-side dispatch.
    Covers action type definition, ActionHandler or OperationHandler creation, and
    DiagramFeatureModule registration. Use this skill whenever the user wants to add
    an action, create a GLSP action, implement an action handler, add an operation,
    handle a request/response, mentions "action", "ActionHandler", "OperationHandler",
    "GLSP action", "DiagramFeatureModule", or needs server-client communication for
    a diagram feature.
---

# Add a New GLSP Action

Guide for adding a new GLSP action to bigUML. Actions are typed JSON messages exchanged between the GLSP client and server. There are two categories: **actions** (queries, notifications) handled by `ActionHandler`, and **operations** (model mutations) handled by `OperationHandler` which support undo/redo.

## Task checklist

- Define action types in `src/env/common/` with `KIND`, `is()`, and `create()` pattern
- Implement `ActionHandler` or `OperationHandler` in `src/env/glsp-server/`
- Register handler in a `DiagramFeatureModule`
- Register the module in `application/vscode/src/server.main.ts`
- (Optional) Dispatch the action from extension host or webview client

## Before you start

Determine which category your action falls into:

| Category  | Base class         | When to use                                          | Undo/redo       |
| --------- | ------------------ | ---------------------------------------------------- | --------------- |
| Action    | `ActionHandler`    | Queries, notifications, responses (no model changes) | No              |
| Operation | `OperationHandler` | Model mutations (create, delete, update)             | Yes (automatic) |

Study existing examples:

- **Request/response action**: `packages/big-property-palette/src/env/common/property-palette.action.ts`
- **Action handler**: `packages/big-property-palette/src/env/glsp-server/generic-element-property-action-handler.ts`
- **Feature module**: `packages/big-property-palette/src/env/glsp-server/property-palette.module.ts`

For full details, read `docs/guides/glsp-server-feature-modules.md`.

## Step 1: Define action types

Create the action types in `src/env/common/`. Every action needs three things: a `KIND` string constant, an `is()` type guard, and a `create()` factory.

### Request/response pattern

For actions that expect a response:

```typescript
// src/env/common/my-feature.action.ts

import { Action, hasStringProp, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

export interface RequestMyDataAction extends RequestAction<SetMyDataAction> {
    kind: typeof RequestMyDataAction.KIND;
    elementId: string;
}

export namespace RequestMyDataAction {
    export const KIND = 'requestMyData';

    export function is(object: any): object is RequestMyDataAction {
        return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId');
    }

    export function create(options: { elementId: string; requestId?: string }): RequestMyDataAction {
        return { kind: KIND, requestId: '', ...options };
    }
}

export interface SetMyDataAction extends ResponseAction {
    kind: typeof SetMyDataAction.KIND;
    data?: MyDataModel;
}

export namespace SetMyDataAction {
    export const KIND = 'setMyData';

    export function is(object: any): object is SetMyDataAction {
        return Action.hasKind(object, KIND);
    }

    export function create(options?: { data?: MyDataModel; responseId?: string }): SetMyDataAction {
        return { kind: KIND, responseId: '', ...options };
    }
}
```

### Fire-and-forget pattern

For actions that don't expect a response:

```typescript
export interface NotifyMyFeatureAction extends Action {
    kind: typeof NotifyMyFeatureAction.KIND;
    payload: string;
}

export namespace NotifyMyFeatureAction {
    export const KIND = 'notifyMyFeature';

    export function is(object: any): object is NotifyMyFeatureAction {
        return Action.hasKind(object, KIND);
    }

    export function create(payload: string): NotifyMyFeatureAction {
        return { kind: KIND, payload };
    }
}
```

## Step 2: Implement the handler

### ActionHandler (non-mutating)

```typescript
// src/env/glsp-server/my-feature.action-handler.ts

import { DiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { ActionHandler, type Action, type MaybeActions } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { RequestMyDataAction, SetMyDataAction } from '../common/my-feature.action.js';

@injectable()
export class RequestMyDataActionHandler implements ActionHandler {
    readonly actionKinds = [RequestMyDataAction.KIND];

    @inject(DiagramModelState)
    protected state: DiagramModelState;

    async execute(action: RequestMyDataAction): Promise<MaybeActions> {
        const element = this.state.index.findIdElement(action.elementId);
        if (!element) {
            return [SetMyDataAction.create()];
        }

        // Build response from semantic model
        const data = this.buildData(element);
        return [SetMyDataAction.create({ data, responseId: action.requestId })];
    }

    private buildData(element: any): MyDataModel {
        // Transform semantic element into response data
    }
}
```

The `responseId` must match the `requestId` from the request for the client to correlate them.

### OperationHandler (mutating)

For model mutations, return a `ModelPatchCommand`:

```typescript
import { DiagramModelIndex, DiagramModelState, ModelPatchCommand } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { OperationHandler, type Command, type Operation } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';

@injectable()
export class MyMutationOperationHandler implements OperationHandler {
    readonly operationKinds = [MyMutationOperation.KIND];

    @inject(DiagramModelState) protected state: DiagramModelState;
    @inject(DiagramModelIndex) protected index: DiagramModelIndex;

    createCommand(operation: MyMutationOperation): Command {
        const path = this.index.findPath(operation.elementId);
        const patches = [{ op: 'replace', path: `${path}/name`, value: operation.newName }];
        return new ModelPatchCommand(this.state, JSON.stringify(patches));
    }
}
```

## Step 3: Register in a DiagramFeatureModule

```typescript
// src/env/glsp-server/my-feature.module.ts

import { DiagramFeatureModule } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { ActionHandlerConstructor, InstanceMultiBinding, OperationHandlerConstructor } from '@eclipse-glsp/server';
import { RequestMyDataActionHandler } from './my-feature.action-handler.js';

class MyFeatureDiagramFeatureModule extends DiagramFeatureModule {
    override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        binding.add(RequestMyDataActionHandler);
    }

    // Only if you have operation handlers:
    // override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
    //     binding.add(MyMutationOperationHandler);
    // }
}

export const myFeatureGlspModule = new MyFeatureDiagramFeatureModule();
```

## Step 4: Register in server.main.ts

```typescript
import { myFeatureGlspModule } from '@borkdominik-biguml/big-<name>/glsp-server';

startGLSPServer({ shared, language: UmlDiagram }, [propertyPaletteModule, outlineModule, advancedSearchGlspModule, myFeatureGlspModule]);
```

## Step 5 (Optional): Dispatch from client

### From the extension host (VSCode)

```typescript
@inject(TYPES.ActionDispatcher) protected actionDispatcher: ActionDispatcher;

const response = await this.actionDispatcher.request(
    RequestMyDataAction.create({ elementId: selectedId })
);
```

### From a webview (browser)

Use `ActionWebviewMessenger` in the provider to dispatch and listen:

```typescript
// In WebviewViewProvider
protected override handleOnReady(): void {
    this.actionMessenger.dispatch(RequestMyDataAction.create({ elementId: this.selectedId }));
}
```

## Common mistakes

- Forgetting `responseId` in the response action - the client will time out waiting for a correlated response
- Using `ActionHandler` when the action mutates the model - mutations must go through `OperationHandler` for undo/redo support
- Importing `@eclipse-glsp/protocol` in server code when `@eclipse-glsp/server` re-exports the same types
- Not adding the module to the `startGLSPServer()` call - the handler won't be registered

## Further reading

- `docs/guides/glsp-server-feature-modules.md` — full feature module architecture
- `docs/glsp-server-architecture.md` — GLSP server internals, request lifecycle
