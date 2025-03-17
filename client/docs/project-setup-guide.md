# Project Setup and Architecture Guide

This section provides a detailed guide on how to set up the **bigUML** project environment and understand its architecture.

## Prerequisites

Ensure the following tools and dependencies are installed:

- **Node.js** (Recommended version: v20.10.0)
- **VS Code** (Latest version)

## Repository Structure

The project follows a modular structure with the following key directories:

```
├── application/    # Entry point to VS Code and the VS Code integration
├── packages/       # Monorepo with different packages, each package has custom features implemented
├── scripts/        # Helper Scripts
├── workspace/      # Folder that will be opened
```

## Application

In this folder, we have two packages called **vscode** and **big-vscode-integration**. The **big-vscode-integration** extends the default GLSP integration to provide an easier API. The **vscode** package is the entry point and is used to create the extension.

### big-vscode-integration

The heart of the architecture, it extends the default integration by allowing easier access to different aspects. It sets up **Inversify** for VS Code and exposes contribution points and default implementations. See the features folder within `big-vscode-integration/src/vscode/features` for all features.

**Files:**

- `vscode-common.config.ts`: Uses Inversify to set up dependency injection.
- `vscode-common.types.ts`: Defines all default implementations and contribution types that you can inject.

The most important features are as follows:

#### Feature: Action

This folder contains the `ActionDispatcher` and the `ActionListener`. They allow different webviews or VS Code-based code to dispatch and listen to actions. They are a wrapper around the `VSCodeConnector` (exposed by the VS Code GLSP Integration - not by us). The `VSCodeConnector`, as the name implies, connects VS Code, the GLSP client, and the server together.

**All actions triggered** will go through this connector and be propagated to the respective component. Both mentioned classes only wrap the API of the connector to allow easier usage. The `ActionDispatcher` allows us to trigger actions, and the `ActionListener` allows us to listen to actions without customizing the connector.

#### Feature: Command

This folder exposes a contribution point to register commands that can be executed within VS Code (Refer to the [VS Code documentation](https://code.visualstudio.com/api) about commands). The handler will be called for your registered command.

#### Feature: Connector

This folder customizes the default connector to allow easier usage. The important classes here are the `ConnectionManager` and the `SelectionService`.

- The `ConnectionManager` maintains information about active GLSP clients (editors, the diagram you see), and you can listen to state changes such as visibility and hiding.
- The `SelectionService` allows you to access the current selection.

#### Feature: GLSP

As mentioned earlier, we are currently transitioning to a **Node.js-based server**. To facilitate this migration, we allow you to access the **model state** (source model files) directly within TypeScript. However, this feature is **experimental**, and some aspects may be missing. Additional functionality will be provided if required.

- ModelState: See [minimap.provider.ts](../packages/big-minimap/src/vscode/minimap.provider.ts) for an example.
- Handle request locally: See [outline-action.handler](../packages/big-outline/src/vscode/outline-action.handler.ts), [outline.module](../packages/big-outline/src/vscode/outline.module.ts),
  [outline-tree.provider](../packages/big-outline/src/vscode/outline-tree.provider),

Moreover, the `packages/uml-protocol/language/uml-adapter` file exposes reusable uml types for the class diagram.

#### Feature: Webview

This folder exposes base classes to write your own (React) webview. It sets up everything so that you can focus on the required implementation.

### vscode

The **vscode** package is the entry point for the whole application. The key file here is `extension.config.ts`, where you can register your own (vscode-based) modules.

## Packages

Here we have all custom (complex) functionalities such as the **Minimap**, **GLSP Client**, **Property Palette**, and more.

### big-components

This folder exposes React-based components that you can use, such as text fields, menus, etc. It also provides a bridge to the extension host for your React webview.

### Others

All complex features have an individual package where everything is defined. Each package is exposed through clear APIs, and dependency injection is used to connect each aspect.

For example, if you want to use the **Minimap**, you need to register the respective module (More details in the next section).

## Structure

Each project follows a specific folder structure designed for modularity, clarity, and environment-specific compatibility.

```
- browser               # Code intended for a browser-based environment.
- common                # Environment-independent code (compatible with both Node.js and browser).
- glsp-client           # Integration folder for the GLSP client (modules).
- vscode                # Integration folder for VS Code.
- vscode-node           # Code that runs exclusively in the Node.js environment for VS Code.
- web                   # Code bundled into a single file for webviews.
```

### Important Rules

- **Integration Folders:** Integration folders must expose modules that can be registered within their respective entry points:

    - `vscode/src/vscode/extension.config.ts`
    - `uml-glsp-client/src/web/uml-starter.ts`

- **Strict Separation of Code:** Do **not** mix code between folders. The **common** folder is the only exception.

    - Importing **browser** code into a **vscode** folder will fail since the VS Code extension host runs in a Node.js environment without browser-specific APIs.
    - Conversely, you **cannot** import the **VS Code API** outside of the `vscode` folder.

- **Webviews and Communication:**
  Webviews run inside an **iframe**, which requires the **browser API** to communicate with the extension host. Use the [VS Code Messenger](https://github.com/TypeFox/vscode-messenger) library for seamless communication between the VS Code extension and your webview. The API simplifies the messaging setup — refer to the **Minimap** example for practical usage.

> **Breaking these rules may lead to significant issues in functionality and stability.**

### Debugging

You can directly debug your **VS Code** backend code within the VS Code debugger by setting breakpoints. However, debugging **Webviews** requires a different [approach](https://code.visualstudio.com/api/extension-guides/webview#inspecting-and-debugging-webviews):

- Open the **Electron DevTools** (via `Help > Toggle Developer Tools`).
- Go to the **Sources** tab.
- Use **Ctrl + P** to search for and open the file you want to debug.

> **Important:** While debugging, you may need to add certain files to the **allowed list** for them to appear in the debugger. An alert will prompt you at the bottom of the developer tools when this is required.

### ESM Modules and Bundlers

Since bigUML operates across different environments (Node.js and browser), the code must be compiled into a single accessible file. This is managed by **esbuild**, which compiles your code and outputs it to the `application/vscode/webviews` folder.

To accommodate this, we maintain two separate TypeScript configuration files:

- One for **Node.js** code.
- One for **browser/React** code.

Additionally, ESM allows the use of `package.json#exports` to control your package's entry points, improving encapsulation and minimizing accidental imports of internal APIs. For more details, see the [Node.js Package Entry Points Documentation](https://nodejs.org/api/packages.html#package-entry-points).

> **Note:** If VS Code fails to import your code after changes, restart the TypeScript server by executing the command `TypeScript: Restart` in the command palette.
