# UML Editor - Client Development

## Getting started with VSCode

Open the `client` directory in VSCode to get started.

To ensure constant code styling and linting support, please make sure to install and enable the recommended VSCode extensions (see [`.vscode/extensions.json`](.vscode/extensions.json)).

## Building

Run yarn in the root directory of this repository in the terminal:

```
yarn
```
Or with the default Build Task either via the menu `Terminal > Run Build Task...` or the keybinding <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>.

<br/>

## Run

### Start Theia Browser app

- Via Terminal:
    ```
    yarn start
    ```
    This command starts the necessary server JARs and the browser app on http://localhost:3000.

- Via VSCode Tasks:
    Start the following tasks either via <kbd>Ctrl</kbd>+<kbd>T</kbd> or menu `Terminal > Run Task...`
    - `Start Browser Backend and Server Jars`
    - `Open Example in Browser`

<br/>

### Starting the Servers

If both server and client were built successfully, the necessary server JARs are copied to `uml-theia-integration/build/`.
The standard start script `start` will start these JARs on application startup (process argument `--startFromJar` is set).
To debug the Servers, please see the server [README](../server/README.md) for more details.
In that case please use the start script `start:debug` or the task `Start Browser Backend in Debug Mode (expects running Server instances)` which expects running server instances (process argument `--startFromJar` is NOT set).

<br/>

## Watching

To avoid having to perform a full build after each change, you can use the following workflow *in VSCode* to enable watching and automatic rebuilding.

As a prerequisite, perform a full build once (see above). Now perform the following steps to watch and automatically build on every file change in any package.

- Via Terminal:
    ```
    yarn watch
    ```

- Via VSCode Tasks:
    Start the following tasks either via <kbd>Ctrl</kbd>+<kbd>T</kbd> or menu `Terminal > Run Task...`
    - `Watch all packages`

<br/>

## Debugging

To debug the Theia components, start backend and frontend via the VSCode launch configs:

1. Both the Model Server and the GLSP Server are started already.
2. Start debug launch configurations either:
   1. via the `Debug` view
   2. via the `Debug sidebar` in the VSCode statusbar
   3. via the `Debug command palette`, accessible with shortcut <kbd>Ctrl</kbd>+<kbd>F11</kbd>
3. Start the Theia backend via the debug launch configuration `Start Browser Backend (expects running GLSP Server instance)`.
4. Start the chrome debug launch configuration `Launch Chrome against localhost`.
5. Check the outputs in the `Debug Console Panel` (open it via the menu `View --> Debug Console`).

To debug the frontend components, please install the recommended [Debugger for Chrome extension](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome).

Hints:
- [General documentation on Debugging in VSCode](https://code.visualstudio.com/docs/editor/debugging)
- FYI: The [Eclipse Keymap extension](https://marketplace.visualstudio.com/items?itemName=alphabotsec.vscode-eclipse-keybindings) ports popular Eclipse keybindings to VSCode.
