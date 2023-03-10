# UML-ModelServer

Project: `com.eclipsesource.uml.modelserver`

---

The UML-Modelserver has the necessary code for running the [EMF.cloud Model Server](https://github.com/eclipse-emfcloud/emfcloud-modelserver) together with the [ModelServer-GLSP integration](https://github.com/eclipse-emfcloud/modelserver-glsp-integration) and consists of UML-specific extensions and features.

## Structure of this repository

- `core`: This package includes all changes necessary to instantiate the model server and UML. The core package includes new classes and interfaces for better code reusability and management.
- `features`: Distinct features not included in the model server library.
- `shared`: Reusable code.
- `uml`: UML-specific code.

## Package: Core

Please read the [EMF.cloud Model Server Documentation](https://www.eclipse.org/emfcloud/documentation/) to understand how the model server works.

### Important Concepts

Those concepts are used all the time:

- `*Command`: Commands are triggered by others (outside the model server) to modify the underlying source model. Every command consists of a `*CommandContribution`, which is the entry point for the model server. Based on the `*CommandContribution`, different _child_ `Commands` can be executed (e.g., create a new `Association` vs. update name of `Enumeration`). Thus, commands are only used to modify the source models. _HINT: Only the `*CommandContribution` is used in the dependency container. The executed commands themselves are plain objects_.

### New Concepts introduced

- `Manifest (Contributions / Plugin System)`: The same concept concerning contributions mentioned in the GLSP-Architecture is used in the model server.

## Package: Feature

The feature package consists of different modules that provide new functionality/features to the application. Those modules reuse contribution points from the core package and offer new ones. They isolate all the necessary code for the feature.

## Package: Shared

The shared package consists of different helper and utility classes. They provide common codes that can be reused in other places.

## Package: UML

The UML package provides all the classes necessary to work with diagram-specific implementations. For every diagram type, there exists a diagram module.

## Package: uml.diagram.\*

Every diagram has its package. To better isolate the different diagrams.

### Structure

- `manifest`: The manifest defines the contribution points to provide the necessary functionality to work with the diagram (e.g., `commands`).

- `commands`: Every necessary operation (CRUD) for diagram elements has its own `Command` / `CommandContribution` (e.g., `CreateAssocationContribution`, `CreateAssocationCompoundCommand`, `CreateAssocationSemanticCommand`).

- `reference`: For easier delete operations (e.g., delete `Edge` if either the source or target has been deleted), there exists a `*DiagramCrossReferenceRemover`, that can check if other elements should also be deleted. Afterward, it returns those commands if necessary. Otherwise, manually defining all the deletions would be required.
