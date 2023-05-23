<!-- TITLE -->
<h1 align="center">bigUML Modeling Tool</h1>

<p align="center">
  <strong>VS Code extension for editing UML diagrams.</strong>
</p>

<!-- DEMO -->
<p align="center">
  <img src="https://user-images.githubusercontent.com/13104167/232125930-af3158e7-397f-4ba6-9d57-e76530b075d0.png" alt="Demo" width="800" />
</p>

<p align="center">
  <a target="_blank" href="https://github.com/borkdominik/bigUML/graphs/contributors">
    <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/borkdominik/bigUML?color=lightgrey&style=for-the-badge" height="20"/>
  </a>
</p>

**bigUML** follows the UML specification to create the different diagrams. This extension is the _client_ integration based on [GLSP](https://www.eclipse.org/glsp/). It comes together with the **bigUML** language server integrated into it, which utilizes the [GLSP-Server](https://github.com/eclipse-glsp/glsp-server) and the [ModelServer](https://github.com/eclipse-emfcloud/modelserver-glsp-integration).

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

Currently, **bigUML** supports the following UML diagram types:

-   Class Diagram

We are working on integrating more diagram types and will subsequently add them in future releases.

Get in touch if you want to contribute!

## Requirements

This extension requires Java JRE 11+ to run.

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

![New File command](https://user-images.githubusercontent.com/13104167/232125866-db586183-59b9-47a3-8b95-b54a85c1c676.png)

### CRUD Operations

You can use the Tool Palette to create new nodes and edges. Afterward, you can reposition and resize them.

TODO GIF

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
