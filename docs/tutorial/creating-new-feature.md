# Creating a new feature

In this tutorial we will focus on creating a new feature with our framework. We'll go through the essential steps required. For better overview, the existing code for the `Property Palette` will be explained in detail. It is recommended to check the base classes used in each step.

The implementation is split into three parts:

- bigGLSP Framework
- bigUML-Server
- bigUML-Client

We will start with the bigGLSP Framework. Due to the complexity, we will only go through the important classes. Explaining every detail can be extensive and may not be necessary for a general understanding. Instead, focusing on key concepts and how they interrelate provides a solid overview without overwhelming with too much detail. If you need more specific information or clarification on certain aspects later, feel free to ask!

## Framework Step 1: Create the feature manifest

Similar to the diagram manifest, each feature within the framework requires its own feature manifest. This ensures that every individual feature has its own specific settings and configurations, allowing for modular development and integration within the overall system.

File: `/com.borkdominik.big.glsp.server/src/main/java/com/borkdominik/big/glsp/server/features/property_palette/BGPropertyPaletteManifest.java`

```java
...
public class BGPropertyPaletteManifest extends BGFeatureManifest {

   @Override
   protected void configure() {
      super.configure();

      // Bind internal used registries
      bind(BGPropertyPaletteProviderRegistry.class).in(Singleton.class);
      bind(BGPropertyProviderRegistry.class).in(Singleton.class);

      // Contribute to GLSP that we have a new action
      install(new BGActionFeatureContribution(BGActionFeatureContribution.Options.builder()
         .clientActions((contribution) -> {
            // The action should be handled by the client
            contribution.addBinding().to(BGSetPropertyPaletteAction.class);
         })
         .handlers((contribution) -> {
            // The following action handlers are registered with GLSP
            contribution.addBinding().to(BGRequestPropertyPaletteHandler.class);
            contribution.addBinding().to(BGUpdateElementPropertyHandler.class);
         })
         .build()));

      install(new BGPropertyPaletteContribution());
   }

}
```

The `BGPropertyPaletteManifest` class configures the property palette feature in the GLSP framework. It sets up necessary components and actions for managing properties of diagram elements. This includes registering essential services and contributing new actions.

## Framework Step-2: Create the handler

Each request within the system requires a corresponding handler to process and respond to it effectively. This ensures that every action initiated by the user or the system is managed correctly.

File: `/com.borkdominik.big.glsp.server/src/main/java/com/borkdominik/big/glsp/server/features/property_palette/handler/BGRequestPropertyPaletteHandler.java`

```java
...
public class BGRequestPropertyPaletteHandler extends BGActionHandler<BGRequestPropertyPaletteAction> {

   private static final Logger LOG = LogManager.getLogger(BGRequestPropertyPaletteHandler.class);

   // Inject our registry which has all the element specific handlers
   @Inject
   protected BGPropertyPaletteProviderRegistry registry;

   @Override
   protected List<Action> executeAction(final BGRequestPropertyPaletteAction action) {
      // Retrieve the active representation of our model
      return modelState.representation().get().map(representation -> {
         var elementId = action.getElementId();

         if (elementId == null) {
            return List.<Action> of(new BGSetPropertyPaletteAction());
         }

         // Check if the elementId exists
         var semanticElementOpt = modelState.getElementIndex().get(elementId);
         if (semanticElementOpt.isEmpty()) {
            return List.<Action> of(new BGSetPropertyPaletteAction());
         }
         var semanticElement = semanticElementOpt.get();

         // Retrieve the correct provider or the default if provided
         var providerOpt = registry.getOrDefault(representation, semanticElement.getClass());
         if (providerOpt.isEmpty()) {
            return List.<Action> of(new BGSetPropertyPaletteAction());
         }
         var provider = providerOpt.get();
         // Retrieve the property palette for the element
         var propertyPalette = provider.provide(semanticElement);

         return List.<Action> of(new BGSetPropertyPaletteAction(propertyPalette));
      }).orElse(List.of(new BGSetPropertyPaletteAction()));
   }
}
```

The `BGRequestPropertyPaletteHandler` class is a specific type of action handler to process requests for property palettes of diagram elements. Upon receiving a `BGRequestPropertyPaletteAction`, this handler:

- Retrieves the current state of the model and identifies the requested element by its ID.
- Checks the existence of the element in the model.
- Fetches the appropriate property palette provider from a registry based on the element's type and the current representation.
- Returns a `BGSetPropertyPaletteAction` with the relevant property palette information for the element, or a default action if no specific properties are found.

This setup ensures that when a request for a property palette is made, the system responds with the correct set of properties for the user to view or edit.

- GLSP Documentation about Actions and Action Handlers: <https://eclipse.dev/glsp/documentation/actionhandler/>

## Framework Step-3: Creating the element specific providers

Typically, each feature in the system is designed to be flexible and customizable. To facilitate this, an interface is created for the feature to define standard behaviors and functionalities. Additionally, a registry is used to manage different implementations or variations of this feature, allowing specific diagram elements to tweak or implement the feature according to their unique requirements. This structure enables a modular and extensible approach, where the behavior of features can be easily adapted or extended by different elements within the framework.

File: `/com.borkdominik.big.glsp.server/src/main/java/com/borkdominik/big/glsp/server/features/property_palette/provider/BGPropertyPaletteProvider.java`

```java
...
public interface BGPropertyPaletteProvider extends BGTypeHandler {
   PropertyPalette provide(EObject element);
}
```

File: `/com.borkdominik.big.glsp.server/src/main/java/com/borkdominik/big/glsp/server/features/property_palette/provider/BGPropertyPaletteProviderRegistry.java`

```java
...
public class BGPropertyPaletteProviderRegistry
   extends BGTypeRegistry<BGPropertyPaletteProvider> {

   @Inject
   public BGPropertyPaletteProviderRegistry(
      final Map<Enumerator, BGPropertyPaletteProvider> defaultProviders,
      final Map<Enumerator, Set<BGPropertyPaletteProvider>> providers) {
      defaultProviders.entrySet().forEach(e -> {
         var value = e.getValue();
         e.getValue().getHandledElementTypes().forEach(type -> {
            defaultValues.put(BGRegistryKey.of(e.getKey(), type), value);
         });
      });

      providers.entrySet().forEach(e -> {
         var representation = e.getKey();

         e.getValue().forEach(provider -> {
            provider.getHandledElementTypes().forEach(key -> {
               register(BGRegistryKey.of(representation, key), provider);
            });
         });
      });
   }
}
```

The `BGPropertyPaletteProviderRegistry` class is a type of registry in the bigGLSP framework that manages `BGPropertyPaletteProvider` instances. These providers determine the property palettes available for different types of diagram elements. This registry is initialized with default providers and can be extended with additional ones for specific element types and representations. It maps these providers to their applicable element types and diagram representations, ensuring that each diagram element has the correct property palette associated with it based on its type and the current context.

## Framework Step-4: Providing a way to contribute

To facilitate other manifests contributing providers to the property palette, you can use a contribution class specifically designed for this purpose.

File: `/com.borkdominik.big.glsp.server/src/main/java/com/borkdominik/big/glsp/server/features/property_palette/BGPropertyPaletteContribution.java`

```java
...
public class BGPropertyPaletteContribution extends BGContributionManifest {
   // Define the options other manifests can provide
   // Lombok is used
   @Getter
   @Builder
   public static class Options {
      protected BGRepresentationManifest manifest;
      protected Set<BGTypeProvider> elementTypes;
      protected Set<Class<? extends BGPropertyProvider>> propertyProviders;
      protected Class<? extends BGPropertyPaletteProvider> defaultPaletteProvider;
      protected Class<? extends BGPropertyPaletteProvider> paletteProvider;
   }

   protected final Options options;

   public BGPropertyPaletteContribution() {
      this(Options.builder().build());
   }

   public BGPropertyPaletteContribution(final Options options) {
      this.options = options;
   }

   @Override
   protected void configure() {
      super.configure();

      // Contribute a single item
      install(new BGRItemContributionModule<>(BGRItemContributionModule.Options
         .<BGPropertyPaletteProvider> BGRItemContributionModuleBuilder()
         .manifest(this.options.manifest)
         .contributionType(TypeLiteralUtils.of(BGPropertyPaletteProvider.class))
         .concreteType(TypeLiteralUtils.of(this.options.defaultPaletteProvider))
         .build()));

      // Contribute a set of elements that need to be created by a factory
      install(new BGRElementFactorySetContributionModule<>(
         BGRElementFactorySetContributionModule.Options
            .<BGPropertyPaletteProvider> BGRElementFactorySetContributionModuleBuilder()
            .manifest(this.options.manifest)
            .elementTypes(this.options.elementTypes)
            .contributionType(TypeLiteralUtils.of(BGPropertyPaletteProvider.class))
            .concreteTypes(TypeLiteralUtils.ofs(options.paletteProvider))
            .build()));

      install(new BGRElementFactorySetContributionModule<>(
         BGRElementFactorySetContributionModule.Options
            .<BGPropertyProvider> BGRElementFactorySetContributionModuleBuilder()
            .manifest(this.options.manifest)
            .elementTypes(this.options.elementTypes)
            .contributionType(TypeLiteralUtils.of(BGPropertyProvider.class))
            .concreteTypes(TypeLiteralUtils.ofs(options.propertyProviders))
            .build()));

   }
}
```

The `BGPropertyPaletteContribution` class extends `BGContributionManifest` to allow other manifests to contribute their property palette providers to the system. Through its inner Options class, it enables customization by specifying element types, property providers, and palette providers that should be included in the property palette system.

In its configuration method, this contribution class installs different types of modules:

- `Item Contribution Module`: It registers a default property palette provider if one is specified in the options. This is for contributing a single, common item across different diagram representations.
- `Element Factory Set Contribution Modules`: These modules are for contributing a set of elements or property providers that are specific to certain types of diagram elements. They allow for the customization and extension of the property palette based on different element types and their respective needs.

This systematization facilitates a modular approach where different parts of the system can contribute their specific configurations to the property palette.

**Hint**: See following package for other contribution modules:

- `/com.borkdominik.big.glsp.server/src/main/java/com/borkdominik/big/glsp/server/core/manifest/contribution`

## Framework Step-5: Installing the feature

File: `/com.borkdominik.big.glsp.server/src/main/java/com/borkdominik/big/glsp/server/features/BGFeatureModule.java`

```java
public class BGFeatureModule extends AbstractModule {

   @Override
   protected void configure() {
      super.configure();

      install(new BGOutlineManifest());
      install(new BGPropertyPaletteManifest());
      install(new BGAutocompleteManifest());
   }
}
```

## bigUML-Server Step: Contributing a default implementation

For our UML class diagram, we will integrate a default property palette provider. This provider will be resued across all diagram elements if they do not provide a provider themselves. This approach simplifies the setup.

File: `/com.borkdominik.big.glsp.uml/src/main/java/com/borkdominik/big/glsp/uml/uml/representation/class_/UMLClassManifest.java`

```java
...
public final class UMLClassManifest extends BGRepresentationManifest {
   @Override
   protected void configure() {
      super.configure();

      ...
      install(new BGPropertyPaletteContribution(BGPropertyPaletteContribution.Options.builder()
         .manifest(this)
         .defaultPaletteProvider(UMLDefaultPropertyPaletteProvider.class)
         .build()));
      ...
   }
}
```

Within the configuration method, we install the previously defined `BGPropertyPaletteContribution` using a options to specify `UMLDefaultPropertyPaletteProvider.class` as the default provider. This setup ensures that when working with UML class diagrams, the property palette will automatically use the properties and behaviors defined in the `UMLDefaultPropertyPaletteProvider` if not defined otherwise in the element manifest.

## bigUML-Client Step 0: Extending the protocol

- File: `big-glsp/client/packages/uml-protocol/src/action-protocol/property-palette.action.ts`
- File: `big-glsp/client/packages/uml-protocol/src/action-protocol/property-palette.model.ts`

Those files have the counterparts of the actions and models defined in the server.

## bigUML-Client Step 1: Providing a webview

The next step will be somewhat more intricate as it involves the simultaneous creation of several files.

Please read the [VSCode Extension API documentation](https://code.visualstudio.com/api) first.

- File: `big-glsp/client/packages/uml-vscode-integration/extension/src/features/property-palette/property-palette.provider.ts`
- File: `big-glsp/client/packages/uml-vscode-integration/extension/src/features/property-palette/property-palette.module.ts`
- File: `big-glsp/client/packages/uml-vscode-integration/extension/src/di.config.ts`

The `property-palette.provider` provides a webview where our property palette will be rendered. The `resolveHTML` method creates a HTML where we load our `bundle`, which has the client-side JS implementation. It will load our property-palette automatically.

The `property-palette.module` and `di.config` are used for [inversify](https://inversify.io/).

## bigUML-Client Step 2: Creating our web-component

- Folder: `big-glsp/client/packages/uml-components/src/property-palette`

We define here the necessary logic to create the UI. This is plain JavaScript/TypeScript and HTML/CSS. We are using [Google Lit](https://lit.dev/) as framework. However, it is planned to replace it with React.

- Used toolkit:
  - <https://github.com/microsoft/vscode-webview-ui-toolkit>
  - <https://www.fast.design/>

## bigUML-Client Step 3: Creating the bundle

- File: `big-glsp/client/packages/uml-vscode-integration/webview/src/property-palette/index.ts`
- File: `big-glsp/client/packages/uml-vscode-integration/webview/.esbuild.mts`

In this files we bootstrap our property-palette and create our bundle, which was used in step 1.

**Hint**: Check the bundles folder.

## bigUML-Client Step 4: Create necessary handlers

- Folder: `big-glsp/client/packages/uml-glsp/src/features/property-palette`
- File: `big-glsp/client/packages/uml-glsp/src/uml-glsp.module.ts`

The VSCode extension is **not** part of the action handler cycle. We can not define any handlers there. We can only listen to already triggered actions and delegate them to the webview. See `onActionMessage` in `big-glsp/client/packages/uml-vscode-integration/extension/src/features/property-palette/property-palette.provider.ts`. If an action is send from the webview, it will be automatically redirected to GLSP.

## Final: Build and Run

Build the repositories and run as described in the documentation.
