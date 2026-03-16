# Documentation

Technical documentation for the bigUML project — a graphical UML modeling tool built as a VSCode extension.

## Architecture

Reference material covering the system design, runtime processes, and core subsystems.

| Document                                                | Topic                                                                             |
| ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [Architecture Overview](architecture-overview.md)       | System-wide architecture, startup sequence, environment model, and package layers |
| [GLSP Server Architecture](glsp-server-architecture.md) | GLSP server internals, operation handlers, GModel creation, and JSON patch flow   |
| [Model Server](model-server.md)                         | Langium model server, RPC protocol, multi-client coordination, and undo/redo      |

## Guides

Task-oriented how-tos for common development scenarios.

| Guide                                                                | Topic                                                          |
| -------------------------------------------------------------------- | -------------------------------------------------------------- |
| [Command Registration](guides/command-registration.md)               | How to register VSCode commands via DI                         |
| [Webview Registration](guides/webview-registration.md)               | How to register webviews, messaging, and bundling              |
| [GLSP Server Feature Modules](guides/glsp-server-feature-modules.md) | How feature packages extend the GLSP server                    |
| [Code Generation Pipeline](guides/property-palette-generator.md)     | Code generation pipeline using the property palette as example |
