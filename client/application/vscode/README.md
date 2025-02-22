<!-- DEMO -->
<p align="center">
  <img src="https://github.com/borkdominik/bigUML/assets/13104167/29201f50-c52c-4498-a1ad-befc365630f1" width="800px" alt="Demo" />
</p>

<!-- TITLE -->
<h1 align="center">bigUML Modeling Tool</h1>

<p align="center">
  <strong>VS Code extension for editing UML diagrams.</strong>
</p>

**bigUML** follows the UML specification to create the different diagrams. This extension is the _client_ integration based on [GLSP](https://www.eclipse.org/glsp/). It comes together with the **bigUML** language server integrated into it, which utilizes the [GLSP-Server](https://github.com/eclipse-glsp/glsp-server) and the [ModelServer](https://github.com/eclipse-emfcloud/modelserver-glsp-integration).

> **bigUML** is at an early stage of development.

---

</br>
</br>

<div align="center">

**[DIAGRAMS](#diagrams) •
[REQUIREMENTS](#requirements) •
[EXAMPLES](#examples)**

</div>

</br>

## Diagrams

Currently, **bigUML** has _basic_ support for the following UML diagram types:

-   Activity Diagram
-   Class Diagram
-   Communication Diagram
-   Deployment Diagram
-   Information Flow Diagram
-   Package Diagram
-   Sequence Diagram
-   State Machine Diagram
-   Use Case Diagram

You can [learn more](https://github.com/borkdominik/bigUML/) about the progress of each diagram type in the repository.

We are actively working on integrating and extending diagram types and will add additional and improved diagrams in future releases.

Get in touch if you want to contribute!

## Requirements

This extension requires Java JRE 17+ to run.

_In the background, the GLSP and the ModelServer will be started. You can get the port of the started server from the `output` channel `bigUML Modeling Tool`._

```
Registered server launchers: ModelServer, GLSPServer
Enabled server launchers: ModelServer, GLSPServer
The [Model-Server] listens on port <port>
The [GLSP-Server] listens on port <port>
```

## Examples

### Create new model

You can create a new model by either using the command `bigUML: New Empty UML Diagram` or with `File -> New File`.

<p align="center">
  <img src="https://github.com/borkdominik/bigUML/assets/13104167/07d49ee9-66ad-47a8-bb1c-b37cbed547c2" alt="New File" width="600" />
</p>

### CRUD Operations

You can use the Tool Palette to create new nodes and edges. Afterward, you can reposition and resize them.

<p align="center">
  <img src="https://github.com/borkdominik/bigUML/assets/13104167/5eacb841-dc28-41e3-b904-d494c3b4b5d4" alt="CRUD Operations" width="600" />
</p>

## Learn More

For more information on how to use the tool, see the [bigUML Documentation](https://github.com/borkdominik/bigUML/tree/main/docs).

Also check out the [GitHub repository](https://github.com/borkdominik/bigUML).

If you like our work, please feel free to [buy us a coffee](https://www.buymeacoffee.com/bigERtool) ☕️

<a href="https://www.buymeacoffee.com/bigERtool" target="_blank">
  <img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Logo" >
</a>

</br>
</br>
</br>

<div align="center">

# Modeling Tools

</div>

<p align="center">
  Check out our other cool tools.
</p>

</br>

<p align="center">
  <img src="https://raw.githubusercontent.com/borkdominik/bigER/main/extension/media/logo.png" alt="Logo" width="150" height="150" />
</p>

<p align="center">
  <b>Open-source ER modeling tool for VS Code supporting hybrid, textual- and graphical editing, multiple notations, and SQL code generation!</b></br>
  <sub><a href="vscode:extension/BIGModelingTools.erdiagram">➜ Install the VS Code Extension</a><sub>
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/39776671/197230584-f045bee2-0d5a-4120-b0cf-3ad7ae7675d8.gif" alt="Demo" width="800" />
</p>
