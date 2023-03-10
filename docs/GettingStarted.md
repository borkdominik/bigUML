# Getting Started

This page describes how to get a running version of bigUML.

Please first install the requirements as described under [Requirements](./Requirements.md)

---

## Server

**Folder**: `server`

You first need to install the following plugin:

- The M2Eclipse (Maven Integration for Eclipse) plugin:
  - Install it via `Help > Install New Software`
  - Maven Integration for Eclipse Update Site - <http://download.eclipse.org/technology/m2e/releases/latest>
  - Install _Maven Integration for Eclipse_

Afterward, you can import the projects:

- Import all maven projects via `File > Import... > Maven > Existing Maven Projects > Root directory: $REPO_LOCATION`.

You must set the active target platform once to resolve all necessary plugins. To do so, open `tartgetplaform.target` (located in the module `targetplatform`) and hit `Set Active Target Platform` in the Target Editor. After the target platform is set, you can reload the target platform on demand.

### Execute from IDE

To start the instances separately, run or debug the following launch configs (`Right Click > Run As`):

- `com.eclipsesource.uml.glsp/UmlGLSPServer.launch` located in module `com.eclipsesource.uml.glsp`
- `com.eclipsesource.uml.modelserver/UmlModelServerServer.launch` located in module `com.eclipsesource.uml.modelserver`

### IDE Recommendations

- Switch the perspective to _Debug_ (`top right corner > Open Perspective > Debug`)
- You can see in this perspective under Debug (`left corner`) the currently running applications, and you can always restart them there or switch between the console outputs
- Create a key shortcut for `Build Clean` (`Window > Preferences > General > Keys > 'Build Clean'`), e.g., `Ctrl + Alt + C`, because sometimes the Eclipse IDE can not build the project and fails. Cleaning the project before starting it again helps

## Client

**Folder**: `client`

Open the `client` folder with VSCode. First you need to install the dependencies:

- _Optional: If you have installed NVM, then write `nvm use` to enable the correct Node version_
- Please write `yarn` to the terminal and let the client install the dependencies. It will also build the application

Next, you can choose between starting **Theia** or the **VSCode extension**.

### Theia

You can run the Theia instance by running the `yarn start:theia:debug` command.

You can execute `yarn watch:theia` to automatically rebuild after changes. To build only Theia, you can use `yarn prepare:theia`. Both commands will build/watch the Theia projects (i.e., their dependencies).

### VSCode

You can run the VSCode extension instance by using the shortcut `default: strg + f5` or on the left side menu, you have to open the `Run and Debug (default: Ctrl + Shift + D)` view, and there you can select the `UML GLSP VSCode Extension (External GLSP Server)` entry to run.

You can execute `yarn watch:vscode` to automatically rebuild after changes. To build only VSCode, you can use `yarn prepare:vscode`. Both commands will build/watch the VSCode projects (i.e., their dependencies).

### Client Recommendations

- `yarn`, `yarn prepare`, and `yarn watch` is for the whole project.
- `Theia` is more "complete", and should have fewer bugs due to the available integrations, but a little bit slower, and you have to test it in the browser
- `VSCode Extension` is relatively new, and can have semantic bugs (e.g., undo, redo), but the development experience is better because it builds faster and you have the debugger already attached
- `VSCode` is an electron application, which means you can open via `Help > Developer Tools` the developer console that you already know from browsers
