# Creating a new diagram

In this tutorial we will focus on creating diagrams with our framework. We'll go through the essential steps to design and customize your own diagrams efficiently. For better overview, the existing code for the `Class` diagram will be explained in detail. It is recommended to check the base classes used in each step.

The implementation is split into two parts:

- bigUML-Server
- bigUML-Client

## Server Step-1: Defining the diagram manifest

In the first step, you'll create a new class that extends `BGRepresentationManifest`. In this class, you'll provide all necessary bindings, setting up the foundation for your diagram's unique functionalities and attributes. This is where you tailor the environment to suit your specific diagram requirements.

File: `/com.borkdominik.big.glsp.uml/src/main/java/com/borkdominik/big/glsp/uml/uml/representation/class_/UMLClassManifest.java`

```java
...
public final class UMLClassManifest extends BGRepresentationManifest {
   // The representation will be used to identify your diagram
   @Override
   public Enumerator representation() {
      return Representation.CLASS;
   }

   @Override
   protected void configure() {
      super.configure();
      // Each diagram has its own tool palette, here we contribute our own palette
      install(new BGToolPaletteContribution(BGToolPaletteContribution.Options.builder()
         .manifest(this)
         .concrete(ClassToolPaletteProvider.class)
         .build()));

      // Each diagram element we support within our representation needs to be installed
      install(new ClassElementManifest(this));
      ...
   }
}
```

In the example code, `UMLClassManifest` extends `BGRepresentationManifest` to define a specific type of diagram: a UML **class** diagram. Within this setup, the diagram's identification is established, and the configuration includes custom `tool palettes` and `elements` specific to UML class diagrams. This approach utilizes the concepts of manifests and contributions to modularly extend and customize the diagram's features and behaviors within the framework. It is also possible to provide default implementations (e.g., `Delete`) so that the diagram element doesn't need to implement it.

## Server Step-2: Define your tool palette

Now, we will define our tool palette, which involves specifying the set of nodes and edges available for users within the UML class diagram.

File: `/com.borkdominik.big.glsp.uml/src/main/java/com/borkdominik/big/glsp/uml/uml/representation/class_/ClassToolPaletteProvider.java`

```java
...
public final class ClassToolPaletteProvider extends BGBaseToolPaletteProvider {
   // Provide the representation for which the ToolPalette is reponsible for
   public ClassToolPaletteProvider() {
      super(Representation.CLASS);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      // Define all the elements we want to provide
      var containers = List.of(
         BGPaletteItemUtil.node(UMLTypes.ABSTRACT_CLASS.prefix(representation), "Abstract Class", "uml-class-icon"),
         BGPaletteItemUtil.node(UMLTypes.CLASS.prefix(representation), "Class", "uml-class-icon")
         ...);
      ...

      return List.of(
         PaletteItem.createPaletteGroup("uml.palette-container", "Container", containers, "symbol-property")
         ...);
   }
}
```

Here, `ClassToolPaletteProvider` extends `BGBaseToolPaletteProvider` to define a specific tool palette for the UML **class** diagram. It sets up various nodes for creating diagram elements, such as abstract classes and regular classes, by listing them under different categories. This configuration allows users to select and use these elements directly from the tool palette when designing their diagrams.

## Server Step-3: Define your diagram element

Now, we will define our diagram elements, which involves setting up the specific visual components that users can add to their UML class diagrams and handling requests triggered by the user.

File: `/com.borkdominik.big.glsp.uml/src/main/java/com/borkdominik/big/glsp/uml/uml/elements/class_/ClassElementManifest.java`

```java
...
public class ClassElementManifest extends BGEMFNodeElementManifest {
   // Define all the element types this manifest should support
   public ClassElementManifest(final BGRepresentationManifest manifest) {
      super(manifest, Set.of(UMLTypes.ABSTRACT_CLASS, UMLTypes.CLASS));
   }

   @Override
   protected void configureElement() {
      // bind our implementation for each contribution
      bindConfiguration(ClassConfiguration.class);
      bindGModelMapper(ClassGModelMapper.class);
      bindCreateHandler(ClassOperationHandler.class);
      ...
   }
}
```

In the code above, `ClassElementManifest` extends `BGEMFNodeElementManifest` to define and support different types of elements within the UML class diagram, specifically abstract classes and regular classes. It configures the necessary implementations for these elements, including model mapping and operational handling. In this file, we can also contribute to specific features directly such as the `PropertyPalette` to provide custom behavior.

**Hint**: The same manifest, can be reused in different representations!

## Server Step 3: Define your configuration

This step is mainly required by GLSP. We will define the necessary configurations for the GLSP environment to ensure it properly supports our custom diagram types and functionalities.

File: `/com.borkdominik.big.glsp.uml/src/main/java/com/borkdominik/big/glsp/uml/uml/elements/class_/ClassConfiguration.java`

```java
...
public class ClassConfiguration extends BGBaseNodeConfiguration {
   // For reusability
   protected final String abstractClassId = UMLTypes.ABSTRACT_CLASS.prefix(representation);
   protected final String classId = UMLTypes.CLASS.prefix(representation);

   // The representation and element types will be automatically provided by guice
   @Inject
   public ClassConfiguration(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   // GLSP-specific information
   @Override
   public Map<String, EClass> getTypeMappings() {
      return Map.of(
         classId, GraphPackage.Literals.GNODE,
         abstractClassId, GraphPackage.Literals.GNODE);
   }

   // Defines if the id can be added to the root
   @Override
   public Set<String> getGraphContainableElements() { return Set.of(classId, abstractClassId); }

   // GLSP-specific information
   @Override
   public Set<ShapeTypeHint> getShapeTypeHints() {
      return Set.of(
         new ShapeTypeHint(classId, true, true, true, false,
            elementConfig()
               .existingConfigurationTypeIds(Set.of(UMLTypes.PROPERTY, UMLTypes.OPERATION))));
   }
}
```

In this code we set up GLSP-specific configurations for our UML class diagrams. It defines how different types of UML class elements, like abstract classes and regular classes, are mapped to the GLSP's graphical node types. This setup includes identifying which elements can be added to the diagram's root and providing shape type hints to guide the visual representation and behavior of these elements within the GLSP environment.

## Server Step-4: Define your GModel mapping

The next steps will focus on the concrete implemenations. We will establish the mapping process from a source model to a graphical model (`gmodel`). This step is crucial for translating visual components that can be displayed and interacted with. This mapping ensures that every element in the source model correctly corresponds to a visual representation.

File: `/com.borkdominik.big.glsp.uml/src/main/java/com/borkdominik/big/glsp/uml/uml/elements/class_/gmodel/ClassGModelMapper.java`

```java
...
public final class ClassGModelMapper extends BGEMFElementGModelMapper<Class, GNode> {
   // The representation and element types will be automatically provided by guice
   @Inject
   public ClassGModelMapper(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   // Map the source model of type Class to a GNode
   // Creates a hierarchy
   @Override
   public GNode map(final Class source) {
      return new GClassBuilder<>(gcmodelContext, source, UMLTypes.CLASS.prefix(representation)).buildGModel();
   }

   // Map the following elements as siblings
   // They will be created next to the node
   @Override
   public List<GModelElement> mapSiblings(final Class source) {
      var siblings = new ArrayList<GModelElement>();

      siblings.addAll(mapHandler.handle(source.getGeneralizations()));
      siblings.addAll(mapHandler.handle(source.getInterfaceRealizations()));
      siblings.addAll(mapHandler.handle(source.getSubstitutions()));

      return siblings;
   }
}
```

Here we define how UML class elements are transformed into graphical nodes (`GNodes`) for visualization in the diagram. It takes the source model of a class and converts it into a graphical representation, ensuring that the visual elements reflect the structure and relationships of the source class model. Additionally, it handles the mapping of related elements, such as generalizations and realizations, as siblings in the graphical space, ensuring a coherent and connected diagram layout.

The `map` method can be implemented in two ways:

- using the GBuilder directly as described here, for example: <https://eclipse.dev/glsp/documentation/gmodel/>

```java
 new GNodeBuilder("node:entity")
   .layout("vbox")
   .add(new GLabelBuilder()
      .text(entity.getName())
      .build())
   .build())
   .collect(Collectors.toList());
```

- using the custom SDK to build the structure.

## Server Step-5: Define your operation handler

The operation handler is responsible for managing all requests related to the specific element. It interprets user actions, such as adding, deleting, or modifying elements, and ensures the correct response and updates are made within the diagram.

File: `/com.borkdominik.big.glsp.uml/src/main/java/com/borkdominik/big/glsp/uml/uml/elements/class_/ClassOperationHandler.java`

```java
...
public class ClassOperationHandler extends BGEMFNodeOperationHandler<Class, Package> {
   // The representation and element types will be automatically provided by guice
   @Inject
   public ClassOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   protected BGCreateNodeSemanticCommand<Class, Package, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final Package parent) {
      var argument = CreatePackagableElementCommand.Argument
         .<Class> createPackageableElementArgumentBuilder()
         .supplier((x) -> {
            var isAbstract = UMLTypes.ABSTRACT_CLASS.isSame(representation, operation.getElementTypeId());
            if (isAbstract) {
               return x.createOwnedClass("Abstract Class", true);
            }

            return x.createOwnedClass("Class", false);
         })
         .build();

      return new CreatePackagableElementCommand<>(commandContext, parent, argument);
   }
}
```

In this context, the `ClassOperationHandler` class extends `BGEMFNodeOperationHandler`, tailored for handling different operations. The `BGEMFNodeOperationHandler` class utilizes the framework's infrastructure to manage node-related actions with less code complexity due to the inheritance of default behaviors.

The `createSemanticCommand` method within `ClassOperationHandler` is designed to handle the creation of new diagram elements, distinguishing between abstract classes and regular classes based on the user's input. When a new node creation is requested (e.g., through a user action in the diagram), this method determines whether the new node should be an abstract class or a regular class based on the element type associated with the operation.

This mechanism simplifies the process of adding new elements to the diagram by providing a streamlined, context-aware approach to node creation. By leveraging the generic capabilities of `BGEMFNodeOperationHandler`, `ClassOperationHandler` efficiently manages the specificities of class diagram element creation, ensuring that new elements are correctly instantiated and added to the model with appropriate properties (such as `abstract` for classes).

## Server Step-6: Install your diagram manifest

Within `/com.borkdominik.big.glsp.uml/src/main/java/com/borkdominik/big/glsp/uml/uml/UMLModule.java` install your `UMLClassManifest`.

## Client Step: Prepare the client

The client part of the system, in contrast to the server-side complexities, is designed to be more straightforward.

File: `big-glsp/client/packages/uml-glsp/src/uml/representation/class/class.module.ts`

```ts
...
export const umlClassDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    registerClassElement(context, UMLDiagramType.CLASS);
    ...
});
```

Similar to the server side, you need to define your elements for your respective diagram representation.

File: `big-glsp/client/packages/uml-glsp/src/uml/elements/class/class.element.ts`

```ts
...
export function registerClassElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UMLDiagramType
): void {
    configureModelElement(context, QualifiedUtil.typeId(representation, 'Class'), NamedElement, NamedElementView);
}
```

Finally, you need to tell GLSP that the respective `typeId` should be of a specific type.

## Final: Build and Run

Build the repositories and run as described in the documentation.
