---
name: new-vscode-command
description: >-
    Add a new VSCode command to bigUML with DI-based registration. Covers implementing
    VSCodeCommand, binding in a VscodeFeatureModule, and declaring in package.json.
    Use this skill whenever the user wants to add a command, register a command,
    create a keyboard shortcut action, add a menu item, mentions "command",
    "VSCode command", "command palette", "registerCommand", "keybinding", or needs
    to trigger an action from the command palette or a menu.
---

# Add a New VSCode Command

Guide for adding a DI-managed VSCode command to bigUML. Commands implement the `VSCodeCommand` interface and are auto-registered by `CommandManager` through multi-injection.

## Task checklist

- Implement the `VSCodeCommand` interface
- Bind to `TYPES.Command` in a `VscodeFeatureModule`
- Add `contributes.commands` entry in `application/vscode/package.json`
- (Optional) Add keybindings, menus, or `when` clauses

## Before you start

Study the existing command implementations:

- `packages/big-vscode/src/env/vscode/features/command/new-file/new-file.command.ts` — full example with service injection
- `packages/big-vscode/src/env/vscode/features/command/default-commands.ts` — lightweight GLSP action commands
- `packages/big-vscode/src/env/vscode/features/command/command.ts` — `VSCodeCommand` interface

For full details, read `docs/guides/command-registration.md`.

## Step 1: Implement VSCodeCommand

```typescript
// packages/<package>/src/env/vscode/my-command.ts

import { type VSCodeCommand } from '@borkdominik-biguml/big-vscode/vscode';
import { inject, injectable } from 'inversify';

@injectable()
export class MyCommand implements VSCodeCommand {
    constructor(@inject(MyService) private service: MyService) {}

    get id(): string {
        return 'bigUML.myFeature.doSomething';
    }

    execute(...args: any[]): void {
        this.service.doSomething(args[0]);
    }
}
```

Key rules:

- The `id` must be globally unique and follow the `bigUML.<feature>.<action>` convention
- The command class must be `@injectable()` for DI
- Inject any services needed via constructor parameters
- `args` come from VSCode when the command is invoked (context menu, keybinding, etc.)

### Commands that dispatch GLSP actions

If the command just forwards a GLSP action and has no other logic, you don't need a separate class. Use `DefaultCommandsProvider` pattern instead:

```typescript
// In a @postConstruct method
vscode.commands.registerCommand('bigUML.myFeature.action', () => {
    this.connector.dispatchAction(MyAction.create());
});
```

But for testability and consistency, a dedicated `VSCodeCommand` class is preferred.

## Step 2: Bind in a VscodeFeatureModule

```typescript
// packages/<package>/src/env/vscode/my-feature.module.ts

import { TYPES, VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';
import { MyCommand } from './my-command.js';
import { MyService } from './my-service.js';

export const myFeatureModule = new VscodeFeatureModule(context => {
    context.bind(MyService).toSelf().inSingletonScope();
    context.bind(TYPES.Command).to(MyCommand);
});
```

How it works: `CommandManager` uses `@multiInject(TYPES.Command)` to collect all bound commands, then calls `vscode.commands.registerCommand()` for each during `@postConstruct`.

If your feature already has a module (e.g., from a webview registration), add the command binding there instead of creating a new module.

## Step 3: Register in extension.config.ts

If this is a new module (not adding to an existing one):

```typescript
import { myFeatureModule } from '@borkdominik-biguml/<package>/vscode';

container.load(myFeatureModule);
```

## Step 4: Declare in package.json

In `application/vscode/package.json`, add the command to `contributes.commands`:

```json
{
    "contributes": {
        "commands": [
            {
                "command": "bigUML.myFeature.doSomething",
                "title": "Do Something",
                "category": "bigUML"
            }
        ]
    }
}
```

This is required - without it, VSCode won't recognize the command in the command palette or keybindings.

### Optional: Add a keybinding

```json
{
    "contributes": {
        "keybindings": [
            {
                "command": "bigUML.myFeature.doSomething",
                "key": "ctrl+shift+d",
                "when": "activeCustomEditorId == 'bigUML.editor'"
            }
        ]
    }
}
```

### Optional: Add to a menu

```json
{
    "contributes": {
        "menus": {
            "explorer/context": [
                {
                    "command": "bigUML.myFeature.doSomething",
                    "when": "resourceExtname == '.uml'",
                    "group": "bigUML"
                }
            ]
        }
    }
}
```

### Optional: Add a when clause

Control when the command is enabled:

```json
{
    "contributes": {
        "commands": [
            {
                "command": "bigUML.myFeature.doSomething",
                "title": "Do Something",
                "category": "bigUML",
                "enablement": "activeCustomEditorId == 'bigUML.editor'"
            }
        ]
    }
}
```

## Common mistakes

- Forgetting the `contributes.commands` entry in `package.json` - the command won't appear in the command palette
- Using a non-unique command ID - will conflict with other extensions
- Missing `@injectable()` decorator - DI container will fail to resolve the command
- Forgetting to load the module in `extension.config.ts` - the binding won't be registered

## Further reading

- `docs/guides/command-registration.md` — complete architecture with class diagrams
