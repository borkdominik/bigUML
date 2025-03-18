# Client

## Requirements

Use the IDE of your choice, but **VSCode** is recommended.

- **VSCode**: <https://code.visualstudio.com/download>
- **Node v20.10.0**: <https://nodejs.org/en/download/releases/>
    - Or use NVM, see below

### Recommended (not necessary!)

It is recommended to use NVM. NVM allows you to manage different versions of Node. You can therefore install the required version for this repository and then switch again to the latest version for your other projects. You can use `nvm use` in the client folder to enable the correct version.

- **Link**: <https://github.com/nvm-sh/nvm>

## Build & Run

First you need to install the dependencies:

- _Optional: If you have installed NVM, then write `nvm use` to enable the correct Node version_
- Please write `npm install` to the terminal and let the client install the dependencies.
- Then write `npm run build` to build the project.
- Start the [server](../server/README.md) (you can use `npm run start:server` or `npm run win:start:server` to start the server **after building it first**).

You can run the VSCode extension instance using the shortcut `default: control + f5`. You can also run it by triggering it in the UI. On the left side menu, you have to open the `Run and Debug (default: Ctrl + Shift + D)` view, and there you can select the `(Debug) UML GLSP VSCode Extension` entry to run.

After code changes, you still need to rebuild. To rebuild the extension, you can use `npm run build`. However, manually rebuilding can be bothersome. You can execute `npm run watch` to automatically rebuild after changes.

Therefore, it is better first to run `npm run watch` in the shell and then to start the extension. Afterward, you can trigger a reload in the extension by using `control + r`.

See [package.json#scripts](./package.json) for a list of available scripts.

## Documentation

Please read the [documentation](./docs/README.md).
