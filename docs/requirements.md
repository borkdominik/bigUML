# Requirements

This page lists all the requirements.

---

## Server

The Server is developed with the following **Eclipse IDE** version:

- **Name**: Eclipse Modeling Tools
- **Version**: 2022-12
- **Download**: <https://www.eclipse.org/downloads/packages/release/2022-12/r/eclipse-modeling-tools>

You also need the following installations:

- **Java 11 JDK**: To start the different servers
- **Java 17 JRE**: To run the Eclipse IDE

## Client

Use the IDE of your choice, but **VSCode** is recommended.

- **VSCode**: <https://code.visualstudio.com/download>
- **Node v16.19.1**: <https://nodejs.org/en/download/releases/>
  - Or use NVM, see below
- **Yarn**: <https://yarnpkg.com/getting-started/install>
  - First enable corepack `corepack enable`
  - Then activate yarn: `corepack prepare yarn@stable --activate`

### Recommended

It is recommended to use NVM. NVM allows you to manage different versions of Node. You can therefore install the required version for this repository and then switch again to the latest version for your other projects. You can use `nvm use` in the client folder to enable the correct version.

- **Link**: <https://github.com/nvm-sh/nvm>
