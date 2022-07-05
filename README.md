# bigUML Editor - Server Development

## Current progress of adding elements

C -> Class Diagram // A -> Activity Diagram // U -> UseCase Diagram // S -> StateMachine Diagram // D -> Deployment
Diagram // O -> Object Diagram

|Element | Modelserver| GLSP  | Client  | Works as intended  |
|---|---|---|---|---|
| Class (C) | ✅  | ✅  | ✅  | ✅  |
| Property (C) | ✅  | ✅  | ✅  | ✅  |
| Association (C) | ✅  | ✅  | ✅  | ✅  |
| Activity (A) | ✅  | ✅  | ✅  | ✅  |
| Interruptible Region (A) | ✅  | ✅  | ✅  | ✅  |
| Partition (A) | ✅  | ✅  | ✅  | ✅  |
| Action (A) | ✅  | ✅  | ✅  | ✅  |
| Call (A) | ✅  | ✅  | ✅  | ✅ |
| TimeEvent (A) | ✅  | ✅  | ✅  | ✅ |
| Event (A) | ✅  | ✅  | ✅  | ✅ |
| Signal (A) | ✅  | ✅  | ✅  | ✅ |
| Condition (A) | ✅  | ✅  | ✅  | ✅  |
| ControlNode (A) | ✅  | ✅  | ✅  | ✅  |
| Pin (A) | ✅  | ✅  | ✅  | ❌  |
| DataNode (A) | ✅  | ✅  | ✅  | ✅  |
| Exceptionhandler (A) | ✅  | ✅  | ✅  | ✅  |
| Controlflow (A) | ✅  | ✅  | ✅  | ✅  |
| Partition (A) | ✅  | ✅  | ✅  | ✅  |
| UseCase (U) | ✅  | ✅  | ✅  | ✅  |
| Extensionpoint (U) | ✅  | ✅  | ✅  | ✅  |
| Package (U) | ✅  | ✅  | ✅  | ✅  |
| Actor (U) | ✅  | ✅  | ✅  | ✅  |
| Component (U) | ✅  | ✅  | ✅  | ✅  |
| Generalization (U) | ✅  | ✅  | ✅  | ✅  |
| Include (U) | ✅  | ✅  | ✅  | ✅  |
| Extend (U) | ✅  | ✅  | ✅  | ✅  |
| StateMachine (S) | ✅  | ✅  | ✅  | ✅  |
| Region within Statemachine (S) | ✅  | ✅  | ✅  | ✅  |
| Ports (In- & Out) (S) | (✅)  | ✅ | ✅  | ✅  |
| State (S) | ✅  | ✅  | ✅  | ✅  |
| Pseudo States (S) | ✅  | ✅  | ✅  | ✅  |
| Final State (S) | ✅  | ✅  | ✅  | ✅  |
| State Behaviour (S) | ✅  | ✅  | ✅  | ✅  |
| Transition (S) | ✅  | ✅  | ✅  | ✅  |
| Artifact (D) | ✅  | ✅  | ✅  | ✅  |
| CommunicationPath (D) | ✅  | ✅  | ✅  | ✅  |
| Deployment Node (D) | ✅  | ✅  | ✅  | ✅  |
| Deployment Specification Node (D) | ✅  | ✅  | ✅  | ✅  |
| Deployment Relationship (D) | ✅  | ✅  | ✅  | ✅  |
| Device (D) | ✅  | ✅  | ✅  | ✅  |
| ExecutionEnvironment (D) | ✅  | ✅  | ✅  | ✅  |
| Comment Edge (General) | ✅  | ✅  | ✅  | ❌  |
| Comment Node (General) | ✅  | ✅  | ✅  | ❌  |
| Object Node (O)| ✅  | ✅  | ✅  | ✅  |
| Attribute Node (O)| ✅  | ✅  | ✅  | ✅  |
| Object Link Edge (O)| ✅  | ✅  | ✅  | ✅  |

## General TODOs

DONE: ✅, DOING: 👨🏼‍💻, NOT STARTED: ❌

- write unit tests! ❌
- edges are not working anymore!!!! ‍✅
- create validation! (when all elements are working) 👨🏼‍💻
- rework UseCase edges to fit other diagram types! 👨🏼‍💻
- put icon files into diagram type specific directories ‍✅
- export tool as test to check the possible VSCode dependencies ❌
- add comment node as general element ✅
- add comment edge as general element ✅
- enable a flexible folder structure (user can define it) ❌
- do not display unotation files for client ❌
- make the different diagram types easier to differentiate (icons and model tabs on client side) ❌
- clean up the diagram types! 👨🏼‍💻
- check if the child node creation works for state machine diagram ❌
- test if the inegrated vertex factory is working as intended ❌
- add students to README as contributors ✅ and to the repo in general ❌

### Contributors during the class Advanced Model Engineering summer term 2021

- Felix Winterleitner
- Kristof Meixner
- Felix Rinker
- Andreas Fend
- Zohreh Gorji
- Johannes Buechele
- Lukas ...
- Dominik ...
- Dejana Stefanowic
- plus two more where their names were not visible on github

## Getting started with the Eclipse IDE

- Please make sure your Eclipse workspace uses a JRE of Java 11.
- We use
  the [Eclipse Modeling Tools](https://www.eclipse.org/downloads/packages/release/2020-12/r/eclipse-modeling-tools)
- The following Eclipse plugins are required:
    - The M2Eclipse (Maven Integration for Eclipse) plugin:
        - Update site location: http://download.eclipse.org/technology/m2e/releases/
        - Install *Maven Integration for Eclipse*
- Import all maven projects via `File > Import... > Maven > Existing Maven Projects > Root directory: $REPO_LOCATION`.
    - You may skip the parent modules (i.e. `com.eclipsesource.uml.parent`, `com.eclipsesource.uml.glsp.app`
      and `com.eclipsesource.uml.modelserver.app`)
    - You need to set the active target platform once to be able to resolve all necessary plugins. To do so,
      open `r2020-09.target` (located in the module `targetplatform`) and hit `Set Active Target Platform` in the Target
      Editor. After the target platform is set, you can simple reload the target platform on demand.

## Build

To build the model server as standalone JAR and execute all component tests execute the following maven goal in the root
directory:

```bash
mvn clean install
```

## Running/Debugging

### Execute from IDE

To start both server instances within the Eclipse IDE, run or debug the Launch Group
configuration `UML-GLSP App.launch` (located in module `com.eclipsesource.uml.modelserver.product`).

To start the instances separately, run or debug the following launch configs as Eclipse products:

- `com.eclipsesource.uml.modelserver.product.launch` located in module `com.eclipsesource.uml.modelserver.product`
- `com.eclipsesource.uml.glsp.product.launch` located in module `com.eclipsesource.uml.glsp.product`
