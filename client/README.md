# Client

## Requirements

Use the IDE of your choice, but **VSCode** is recommended.

- **VSCode**: <https://code.visualstudio.com/download>
- **Node v16.20.2**: <https://nodejs.org/en/download/releases/>
    - Or use NVM, see below
- **Yarn v1.22.19**: <https://yarnpkg.com/getting-started/install>
    - First enable corepack `corepack enable`
    - Then activate yarn: `corepack prepare yarn@stable --activate`

### Recommended

It is recommended to use NVM. NVM allows you to manage different versions of Node. You can therefore install the required version for this repository and then switch again to the latest version for your other projects. You can use `nvm use` in the client folder to enable the correct version.

- **Link**: <https://github.com/nvm-sh/nvm>

## Build & Run

First you need to install the dependencies:

- _Optional: If you have installed NVM, then write `nvm use` to enable the correct Node version_
- Please write `yarn` to the terminal and let the client install the dependencies. It will also build the application

You can run the VSCode extension instance using the shortcut `default: strg + f5`. You can also run it by triggering it in the UI. On the left side menu, you have to open the `Run and Debug (default: Ctrl + Shift + D)` view, and there you can select the `(Debug) UML GLSP VSCode Extension` entry to run.

After code changes, you still need to rebuild. To rebuild the extension, you can use `yarn`. However, manually rebuilding can be bothersome. You can execute `yarn watch` to automatically rebuild after changes.

Therefore, it is better first to run `yarn watch` in the shell and then to start the extension.

## Structure of this repository

- `packages/big-components:` Custom webcomponents for easier usage (e.g., Property Palette).
- `packages/uml-glsp:` Customized client part of GLSP.
- `packages/uml-protocol:` Customized protocol part of GLSP.
- `packages/uml-vscode-integration:` Integration for VSCode.

## big-components

Contains WebComponents based on [Lit](https://lit.dev/). Features that are outside of GLSP are usually implemented here.

> Notice: Will be replaced with React.

## UML-GLSP

The client part of GLSP is implemented in this package.

### Structure

The more exciting parts of this package are explained here.

- `features`: This folder provides the client part of the features provided by the UML-GLSP-Server (e.g., `outline`, `property-palette`) or replaces the features provided by GLSP (e.g., `tool-palette`).
- `uml`: This folder provides the UML-specific modules and code. The necessary (dependency-) bindings are provided here for every UML module.

## UML-VSCode-Integration

The UML-VSCode-Integration is a [VSCode Extension](https://code.visualstudio.com/api). It uses the [GLSP-VSCode integration](https://github.com/eclipse-glsp/glsp-vscode-integration) to provide the UML editor for VSCode.

### Structure

The VSCode integration consists of two parts: the `extension` and the `webview`. The `webview` packages consists of webviews that are used in the VSCode extension context through an _iframe_. They communicate through the [vscode-messenger](https://github.com/TypeFox/vscode-messenger) with the extension. The `extension` loads the webview and is responsible for the extension lifecycle.

- VSCode Extension API: <https://code.visualstudio.com/api>
