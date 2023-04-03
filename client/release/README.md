# VSCode Extension

This document describes how to install and test the VSCode extension.

## Requirements

### VSCode

Install VSCode <https://code.visualstudio.com/> for your distribution (e.g., Windows, Ubuntu).

### Java

You need Java version 11+ (tested with 11 and 17) to start the servers in the background.

-   Oracle Java 17 JDK: <https://www.oracle.com/java/technologies/downloads/#java17>

## Setup

The extension can be currently found under

-   Link: <https://drive.google.com/drive/folders/1nOceTdLBiDOg4sYPlTKoaufqNa9bnd1z?usp=share_link>

Later, releases will be moved to GitHub and the VSCode Marketplace.

### Extension Installation

Please download the latest version of the extension. Then open the command palette (default: `strg + shift + p`) and select `>Extensions: Install from VSIX`. Afterward, select the `biguml-vscode-x.x.x.vsix` file. After that, the extension will be installed.

-   Sources: <https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix>

### Example

The downloaded `zip` provides a basic demo example. You can open it or create your diagram by:

-   clicking `File -> New File` in VSCode
-   doing a `right click` in the explorer and then clicking on `New Empty UML Diagram`
-   using the command palette `>bigUML: New Empty UML Diagram`

## Important

### Windows

We start in the background two Java servers with random ports. Windows will show you are Windows Security Alert. The alert is expected.

### Opening Files

Opening diagrams can take a little bit of time, due to starting the servers in the background.
