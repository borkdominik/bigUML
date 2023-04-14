# bigUML - VS Code Extension

<!-- DESCRIPTION -->

> [Open-source](https://github.com/borkdominik/bigUML) **UML Modeling Tool** for [Visual Studio Code](https://code.visualstudio.com/) supporting graphical editing diagrams.

<p align="center">
  <img src="./resources/biguml-vscode.png" alt="Demo" width="800" />
</p>

<br />

**📖 Table of Contents**

1. [Diagrams](#diagrams)
2. [Requirements](#requirements)
3. [Examples](#examples)
    - [Create new model](#create-new-model)

<br />

## Diagrams

The supported diagrams are visible in the table. More diagrams will be supported in the future.

### Structure Diagrams

| SD     | Class       | Component | Deployment | Object | Package | Profile | Composite |
| ------ | ----------- | --------- | ---------- | ------ | ------- | ------- | --------- |
| Status | In progress | -         | -          | -      | -       | -       | -         |

### Behavior Diagrams

| BD     | Use Case | Activity | State Machine | Sequence                 | Communication       | Interaction | Timing |
| ------ | -------- | -------- | ------------- | ------------------------ | ------------------- | ----------- | ------ |
| Status | -        | -        | -             | Contribution in progress | Development started | -           | -      |

## Requirements

This extension requires Java JRE 11+ to run.

_In the background two Java-based language servers will be started._

## Examples

### Create new model

You can create a new model by either using the command `bigUML: New Empty UML Diagram` or with `File -> New File`.

![New File Command](./resources/new-model-command.png)
