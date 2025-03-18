# Graphical Language Server Platform (GLSP)

The **Graphical Language Server Platform (GLSP)** is a framework designed to enable graphical modeling tools in web-based and desktop IDE environments such as **VS Code**. It follows the language server architecture and simplifies the development of diagram editors.

This section covers the following topics to help you understand and implement GLSP within bigUML:

## Introduction to GLSP

For an overview of GLSP, it is highly recommended to watch the following video, which explains the core concepts and architecture in detail:

- [GLSP Introduction Video](https://www.youtube.com/watch?v=RBbI_QBzwl4)

GLSP is a client-server framework that separates the graphical modeling logic from the IDE environment. The GLSP server manages the modeling logic, while the client handles the user interface within the IDE.

- [GLSP Overview](https://www.eclipse.org/glsp/)
- [GLSP Documentation](https://www.eclipse.org/glsp/documentation/)

## GLSP Client-Server Architecture

In bigUML, we are using three GLSP frameworks:

- **GLSP Client**: [glsp-client](https://github.com/eclipse-glsp/glsp-client)
- **VS Code Integration**: [glsp-vscode-integration](https://github.com/eclipse-glsp/glsp-vscode-integration)
- **GLSP Server** (Java-based): [glsp-server](https://github.com/eclipse-glsp/glsp-server)

The VS Code integration provides a default implementation that allows the GLSP client to be rendered and connected with a GLSP server. While we are currently using a Java-based server, the server is in the process of being rewritten in Node.js.

At the core, we have **actions** (essentially a messaging pattern). To communicate between the client and server (and vice versa), you need to dispatch an action: [GLSP Actions Documentation](https://eclipse.dev/glsp/documentation/actionhandler/). The same mechanism also applies if you want to communicate between client-to-client interactions (more details on this later).

It is highly recommended to read the documentation on actions, as they are a crucial aspect of GLSP.

An outline of the most important actions can also be found in the [documentation](https://eclipse.dev/glsp/documentation/protocol/).
