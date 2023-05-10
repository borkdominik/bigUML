# Actions & Action Handlers

Project: `com.eclipsesource.uml.glsp`

GLSP uses `Actions & Action Handlers` to communicate between different components. In the UML-GLSP server, we extend those `Action Handlers` to allow better integration with the various UML diagrams.

---

First, read the [GLSP Actions & Action Handlers Documentation](https://www.eclipse.org/glsp/documentation/actionhandler/) to understand how `Actions & Action Handlers` work.

There are two ways to use `Actions` and `Action Handlers` in the UML-GLSP server.

## Directly

In this approach, you extend the GLSP framework directly by introducing new `Actions` and `Action Handlers`. This approach is meaningful if you implement new features or are sure that the `Actions` and their `Action Handlers` will always be unique and that only one place will work with them. They do not differentiate between the different `representations`. They can be used in any module (e.g., `core`, `features`, `uml`).

### Direct Example

- Action:
  - `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/uml/diagram/class_diagram/handler/action/RequestTypeInformationAction.java`
  - `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/uml/diagram/class_diagram/handler/action/SetTypeInformationAction.java`
- Action Handler:
  - `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/uml/diagram/class_diagram/handler/action/RequestTypeInformationHandler.java`

We define here a `Request` and `Response` pair and the `Action Handler` for the `Request`. The `Action Handler` redirects the request to the model server, but it could also do the necessary calculating/processing itself.

Finally, those handlers must still be registered in the `Manifest`. The `ClientActionContribution` registers `Actions` that will be handled by the **Client** (e.g., `SetTypeInformationAction`), and the `ActionHandlerContribution` registers the `Action Handlers` to handle the `Requests`.

## Representation Separation

However, to allow more flexibility and to respect the different diagram `representations`, we can extend the default `Action Handlers`. Here, we use the **direct** approach together with `Registries`. They should only be used in the `core` and `feature` modules.

### Registries

`Registries` allow grouping implementations by their `representation`. They provide a key value based access. With this approach, it is possible to use the implementation of the `uml` module to handle an `Action`. Consequently, `Action Handlers` use those `Registries` to retrieve the correct functionality using the active `representation`.

### Registry Examples

- Create Handler

  - Registry: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/core/handler/operation/create/DiagramCreateHandlerRegistry.java` (Value: set of implementations)
  - Action Handler: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/core/handler/operation/create/UmlCreateNodeOperationHandler.java`
  - Delegated Functionality: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/core/handler/operation/create/DiagramCreateHandler.java`
  - Contribution: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/core/manifest/contributions/diagram/DiagramCreateHandlerContribution.java`

- Outline Handler
  - Registry: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/features/outline/handler/action/DiagramOutlineGeneratorRegistry.java` (Value: a single implementation)
  - Action Handler: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/features/outline/handler/action/RequestOutlineHandler.java`
  - Delegated Functionality: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/features/outline/generator/DiagramOutlineGenerator.java`
  - Contribution: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/features/outline/manifest/contributions/OutlineGeneratorContribution.java`

Delegating a functionality works by defining an `interface` or a base `class`. Next, in the `Manifest`, the modules bind the delegated functionality using the `Contribution`. The `Registry` loads based on the `Contribution` those `Maps / Dictionaries` and registers them. Afterward, the `Action Handler` can access the delegated functionality by providing the active `representation`.

## Summary

In the `direct` approach, the GLSP framework is extended as described in the GLSP documentation by using the `core module` directly or by using `Contributions`. This approach can be used if the implemented functionality is independent of the `representation`.

If the functionality is based on the `representation`, then the second approach should be used as it allows to delegate functionality to the `uml` modules.
