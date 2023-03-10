# UML-GLSP

Project: `com.eclipsesource.uml.glsp`

The UML-GLSP server has the necessary code for running the [GLSP-Server](https://github.com/eclipse-glsp/glsp-server) and consists of UML-specific extensions and features.

---

## Structure of this repository

- `core`: This package includes all changes necessary to instantiate GLSP and UML. The core package also includes new classes and interfaces for better code reusability and management.
- `features`: Distinct features not included in the GLSP-Server library, e.g., _diagram outline_, _property-palette_.
- `uml`: UML-specific code.

## Package: Core

Please read the server-specific parts of the [GLSP-Documentation](https://www.eclipse.org/glsp/documentation/overview/).

All concepts explained there are also used in the core package. The core package is the foundation/root of the whole UML-GLSP server. **Features** and **UML** modules are injected into this package.

### Important Concepts

Those concepts are used all the time (see for more the GLSP-Documentation):

- `*Action`: An action is an event of interest triggered somewhere or an occurrence to which you want to react.
- `*ActionHandler`: `ActionHandlers` react to actions and execute custom code.
- `*GModel`: A GModel describes the model of how the element should be rendered in the client.
- `*Operation`: Operations are subtypes of actions, with the distinct difference that their goal is to modify the source model (e.g., CRUD operations).
- `*OperationHandler`: `OperationHandlers` react to operations.
- `UmlDiagramModule`: GLSP uses dependency injection. All the diagram-specific bindings are defined in this _root_ module. This module also installs the **feature** and **UML** manifests (e.g., see `configureAdditionals` in this file).

### New Concepts introduced

- `Manifest (Contributions / Plugin System)`: The core package has no direct information about either new features or UML-specific modules. Thus the core package provides contributions points to which other modules can contribute. For example, `DiagramCreateHandlerContribution` allows other modules to register based on a _representation/diagram type_ different `DiagramCreateHandlers`. The `DiagramCreateHandler` is an interface (i.e., a contract) that the other module has to fulfill. Those `DiagramCreateHandlers` are loaded by the core package through dependency injection and used in the `UmlCreate*OperationHandler`. Consequently, every other module has to implement a manifest file and define which contributions it wants to make to and install the manifest in the core module.

- `Representation Separation`: Every UML module has its own _representation/diagram type_ (e.g., class diagram, communication diagram). Depending on the currently active diagram type, the core package can differentiate between those representations and forward the request to the correct module. That allows the developers to implement different aspects of the same element (e.g., `Lifeline`) for different UML diagrams (e.g., communication diagram, sequence diagram).

## Package: Feature

The feature package consists of different modules that provide new functionality/features to the application. Those modules reuse contribution points from the core package and provide new contribution points. They isolate all the necessary code for the feature.

## Package: UML

The UML package provides all the classes necessary to work with diagram-specific implementations.

- That also includes base classes for easier code usage. For example, `BaseCreateHandler` implements the interface `DiagramCreateHandler` (as previously mentioned) to provide better code reusability for the UML modules.

- And for every diagram type, there exists a diagram module.

## Package: uml.diagram.\*

Every diagram has its package. To better isolate the different diagrams.

### Structure

- `manifest`: The manifest defines the contribution points to provide the necessary functionality to work with the diagram (e.g., `*GModelMapper`, `Create*Handler`).

- `diagram`: Every diagram element is defined here (e.g., `UmlClass_Association`). Those classes provide unique ids, variants, properties, and configurations. The ids and variant ids are used in different places to know which element is meant. The properties allow for better differentiation for updates (i.e., update the visibility kind of the association). The configuration supplies the graph (i.e., the diagram) with metainformation (e.g., if an element is a container or can be positioned or resized).

- `handler.action`: Diagram specific `actions` and `ActionHandlers`

- `handler.operation`: Every element (e.g., `Association`, `DataType`, `Generalization`) has its handler for _create_, _delete_, and _update_.

- `gmodel`: Every element (e.g., `Class`, `PrimitiveType`, `Usage`) has its own `GModelMapper`. Those mappers map the incoming element to the respective `GModel`.

- `features`: The required feature implementation provided by the core package (e.g., `tool palette`, `label edit`) and the feature package (e.g., `property palette`) are implemented here.

## Additionally

The UML-GLSP-Server has support for **EMF.cloud Model Server**. The [ModelServer-GLSP integration](https://github.com/eclipse-emfcloud/modelserver-glsp-integration) is already included.

## Conclusion

The **feature** and **UML** modules are semantically identical to the core module. That means it does not differentiate if a **feature** or a **UML** module has been registered. Every non-core module has to use contribution points to interact with the core module.

That means that the core package is lightweight as possible, has no diagram or feature-specific information, and consists only of the necessary code to be able to run the application.

All the implementation details (UML) are in their module (i.e., package: UML) and do not influence each other.
