# Creating Nodes

Here we will learn how to create nodes. This tutorial is the follow-up of [Preparations](./0_Preparations.md).

---

The UML-ModelServer creates (and also updates, deletes, and more) the source models. Therefore we now need to implement the logic for it. The logic for such operations is put into `command` classes. A `command` is an operation that changes the source model.

The UML-GLSP-Server afterward uses those `commands` to trigger a change caused by an action.

In this tutorial, we will also learn how to

- prepare GLSP to work with the model server
- draw elements in the diagram

The goal is to create for the `Component` diagram the element called `artifact`.

## UML-ModelServer

### ML-Step 1: Creating the semantic command

Create the following `Java Class` file:

- Name: `CreateArtifactSemanticCommand`
- Path: `/com.eclipsesource.uml.modelserver/src/main/java/com/eclipsesource/uml/modelserver/uml/diagram/demo_diagram/commands/artifact/CreateArtifactSemanticCommand.java` (create packages if necessary)

Put the following content into the file.

```java
package com.eclipsesource.uml.modelserver.uml.diagram.demo.commands.artifact;

import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreateArtifactSemanticCommand extends BaseCreateSemanticChildCommand<Model, Artifact> {

   public CreateArtifactSemanticCommand(final ModelContext context, final Model parent) {
      super(context, parent);
   }

   @Override
   protected Artifact createSemanticElement(final Model parent) {
      var nameGenerator = new ListNameGenerator(Artifact.class, parent.getPackagedElements());

      var artifact = UMLFactory.eINSTANCE.createArtifact();
      artifact.setName(nameGenerator.newName());
      parent.getPackagedElements().add(artifact);

      return artifact;
   }

}
```

Here some interesting things happen. First, our command extends `BaseCreateSemanticChildCommand`. This base class makes our lives easier by abstracting everything away we don't need to know. Further, we say that we expect that our parent is the `Model` itself and that we will create a `Artifact` object with our command. In the `createSemanticElement` method, we create our object, assign a new name, and then add it to our parent. The result is then returned for further use.

#### MS-Step1: Important

- Every element has a parent. Therefore, find out about your element (i.e., use papyrus), then implement.
- You could hardcode the name, but `ListNameGenerator` generates a new name for us (it appends a number to the end)
- The same approach also applies to deleting and updating. They just have different base classes and do something different. Go and find the base classes for them.

### ML-Step 2: Creating the compound command

Create the following `Java Class` file:

- Name: `CreateArtifactCompoundCommand`
- Path: `/com.eclipsesource.uml.modelserver/src/main/java/com/eclipsesource/uml/modelserver/uml/diagram/demo_diagram/commands/artifact/CreateArtifactCompoundCommand.java` (create packages if necessary)

Put the following content into the file.

```java
package com.eclipsesource.uml.modelserver.uml.diagram.demo.commands.artifact;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;

public final class CreateArtifactCompoundCommand extends CompoundCommand {

   public CreateArtifactCompoundCommand(final ModelContext context, final Model parent,
      final GPoint position) {
      var command = new CreateArtifactSemanticCommand(context, parent);

      this.append(command);
      this.append(
         new AddShapeNotationCommand(context, command::getSemanticElement, position, GraphUtil.dimension(160, 50)));
   }
}
```

Whereas the semantic command creates the object itself, the `CompoundCommand` defines all the commands that should execute. Here we see that we want to execute `CreateArtifactSemanticCommand`, which will create our `Artifact`, and we also want to execute `AddShapeNotationCommand`. This command is provided by bigUML, and it generates the shape structure for our `Artifact`. The shape has meta information like the element's position or size. The former is called the semantic, and the latter the notation of an element. In other words, we now execute two commands - namely, create the semantic and the notation of a `Artifact` object.

#### MS-Step2: Important

- Sometimes, the `CompoundCommand` can be skipped. Such cases are, for example, if you just want to execute a single command. Can you think about such a case?

### ML-Step 3: Creating the command contribution

Create the following `Java Class` file:

- Name: `CreateArtifactContribution`
- Path: `/com.eclipsesource.uml.modelserver/src/main/java/com/eclipsesource/uml/modelserver/uml/diagram/demo_diagram/commands/artifact/CreateArtifactContribution.java` (create packages if necessary)

Put the following content into the file.

```java
package com.eclipsesource.uml.modelserver.uml.diagram.demo.commands.artifact;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;

public final class CreateArtifactContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "component:add_artifact";

   public static CCommand create(final Model parent, final GPoint position) {
      return new ContributionEncoder().type(TYPE).parent(parent).position(position).ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(modelUri, domain, command);

      var context = decoder.context();
      var parent = decoder.parent(Model.class);
      var position = decoder.position().get();

      return parent
         .<Command> map(p -> new CreateArtifactCompoundCommand(context, p, position))
         .orElse(new NoopCommand());
   }

}
```

A `CommandContribution` (not the same as a `manifest contribution`) is the glue code between UML-GLSP-Server and the UML-ModelServer. We need to investigate two parts.

The static `create` method will be called by UML-GLSP-Server. We create a request and encode it (see `ContributionEncoder`). The encoder uses the `type`, `position`, and `parent` to create a unique request. Therefore it is **important** that the `type` is unique! The `type` is used to map the request correctly. The encoded command will be transferred from the UML-GLSP-Server to the UML-ModelServer.

The incoming request is then decoded in `toServer` with `ContributionDecoder`. We then read the content of our request (e.g., the `parent`, `position`) and execute our `CreateArtifactCompoundCommand`.

#### MS-Step3: Important

- We encode our requests, send them, decode them, and execute our commands.
- The encoder and decoder have more methods; check them out.
- As visible, we create a plain object (`CreateArtifactCompoundCommand`). Therefore the commands do **not** have access to dependency injection.

### ML-Step 4: Bind the Command Contribution

Open the file `DemoManifest.java`.

- path: `/com.eclipsesource.uml.modelserver/src/main/java/com/eclipsesource/uml/modelserver/uml/diagram/demo_diagram/manifest/DemoManifest.java`

Implement the interface `CommandCodecContribution` and extend the method to be like

```java
   @Override
   protected void configure() {
      super.configure();
      contributeCommandCodec(binder(), (contributions) -> {
        contributions.addBinding(CreateArtifactContribution.TYPE).to(CreateArtifactContribution.class);
      });
   }
```

By implementing the interface, we say that our manifest wants to make a `CommandCodecContribution`. The implementation allows us to use the method `contributeCommandCodec`. This method takes the `binder()` (dependency injection) and binds our `CreateArtifactContribution` to the correct place.

Now, our UML-ModelServer is ready to listen to `commands`. If a `command` of type `CreateArtifactContribution.TYPE` arrives, the core will map it to the correct place (== `CreateArtifactContribution`). There, we will create our child `commands`, and they will create the semantics and notation of our `Artifact`.

#### MS-Step4: Important

- `Contributions` (e.g., `CommandCodecContribution`) are interfaces that provide a default implementation. The default implementation setups in the background the necessary bindings so that you only have to provide your _Classes_. Everything else is done for you.
- Again, `Command Contributions` are different from `Manifest Contributions`.

---

## UML-GLSP-Server

The UML-GLSP-Server now needs to

- create the previously defined command (`CreateArtifactContribution.create(...)`)
- map the source (semantics and notation) to a structure that the client understands

### GS-Step 1: Create a configuration for Artifact

Create the following `Java Class` file:

- Name: `UmlDemo_Artifact`
- Path: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/uml/diagram/demo_diagram/diagram/UmlDemo_Artifact.java` (create packages if necessary)

Put the following content into the file.

```java
package com.eclipsesource.uml.glsp.uml.diagram.demo_diagram.diagram;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.ShapeTypeHint;
import org.eclipse.uml2.uml.Artifact;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration;
import com.eclipsesource.uml.glsp.uml.utils.QualifiedUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class UmlDemo_Artifact {
   public static String typeId() {
      return QualifiedUtil.representationTypeId(Representation.COMPONENT, DefaultTypes.NODE,
         Artifact.class.getSimpleName());
   }

   public enum Property {}

   public static class DiagramConfiguration implements DiagramElementConfiguration.Node {

      @Override
      public Map<String, EClass> getTypeMappings() { return Map.of(
         typeId(), GraphPackage.Literals.GNODE); }

      @Override
      public Set<String> getGraphContainableElements() { return Set.of(typeId()); }

      @Override
      public Set<ShapeTypeHint> getShapeTypeHints() {
         return Set.of(
            new ShapeTypeHint(typeId(), true, true, true, false,
               List.of()));
      }
   }
}
```

The file `UmlDemo_Artifact` aims to configure or provide constants concerning an element in a diagram.

- The `typeId` is a unique id that points to this element alone. It should be unique for all diagrams.
- The `property` is used to differentiate between the properties of an element (e.g., `name`, `isAbstract`)
- The `DiagramConfiguration`, which implements the `.Node` version of the `DiagramElementConfiguration`, provides some meta information to the application. For example, the `Artifact` can be added to the graph's root and is defined under `getGraphContainableElements`. The method `getTypeMappings` defines to which `GModel` the element will be mapped to and `getShapeTypeHints` returns some information concerning deletable, resizeable and so on.

#### GS-Step1: Important

- Every element has its diagram file and thus configuration. You can define your constants for a element in this file.

### GS-Step 2: Add the Artifact to the tool palette

Create the following `Java Class` file:

- Name: `DemoToolPaletteConfiguration`
- Path: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/uml/diagram/demo_diagram/features/tool_palette/DemoToolPaletteConfiguration.java` (create packages if necessary)

Put the following content into the file.

```java
package com.eclipsesource.uml.glsp.uml.diagram.demo_diagram.features.tool_palette;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.core.features.tool_palette.ToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.demo_diagram.diagram.UmlDemo_Artifact;

public class DemoToolPaletteConfiguration implements ToolPaletteConfiguration {
   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(UmlDemo_Artifact.typeId(), "Artifact", "uml-artifact-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }
}
```

The `DemoToolPaletteConfiguration` provides the core package with information about which items the tool palette should show.

### GS-Step 3: Map the Artifact to the GModel

Create the following `Java Class` file:

- Name: `DemoToolPaletteConfiguration`
- Path: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/uml/diagram/demo_diagram/features/tool_palette/DemoToolPaletteConfiguration.java` (create packages if necessary)

Put the following content into the file.

```java
package com.eclipsesource.uml.glsp.uml.diagram.demo_diagram.gmodel;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Artifact;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.demo_diagram.diagram.UmlDemo_Artifact;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class ArtifactNodeMapper extends BaseGNodeMapper<Artifact, GNode>
   implements NamedElementGBuilder<Artifact> {

   @Override
   public GNode map(final Artifact source) {
      var builder = new GNodeBuilder(UmlDemo_Artifact.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final Artifact source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX);

      header.add(textBuilder(source, "<<Artifact>>").build());
      header.add(buildIconVisibilityName(source, "--uml-artifact-icon"));

      return header.build();
   }
}
```

This file maps the `Artifact` to a `GNode`. The GModel is the structure that the client understands and renders. Here we define that we want to use a `GNodeBuilder` as the base.

#### GS-Step3: Important

- Every element needs to have its own `GModelMapper`.
- The GLSP documentation explains how to create the GModels.
- You define here how the element should be rendered. Do you want to add a header? Do the elements render children? Do you want a different CSS? The mapper needs to apply all of them here.
- The notation (position, size) is applied by the method `applyShapeNotation`.
- The class diagram already provides the common mappers. You can check them out.
- Some builders are outsourced (e.g., `NamedElementGBuilder`). Due to convenience. The same rules for `GModels` explained by the GLSP documentation still apply.

### GS-Step 4: Map the CreateOperation to the CreateArtifactContribution

Create the following `Java Class` file:

- Name: `CreateArtifactHandler`
- Path: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/uml/diagram/demo_diagram/handler/operation/artifact/CreateArtifactHandler.java` (create packages if necessary)

Put the following content into the file.

```java
package com.eclipsesource.uml.glsp.uml.diagram.demo_diagram.handler.operation.artifact;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.glsp.uml.diagram.demo_diagram.diagram.UmlDemo_Artifact;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.demo_diagram.commands.artifact.CreateArtifactContribution;

public class CreateArtifactHandler extends BaseCreateChildNodeHandler<Model>
   implements CreateLocationAwareNodeHandler {

   public CreateArtifactHandler() {
      super(UmlDemo_Artifact.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final Model parent) {
      return CreateArtifactContribution.create(
         parent,
         relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)));
   }
}
```

Do you remember the step where we created the tool palette? There was a line where you used `UmlDemo_Artifact.typeId()`; go recheck it. The client sends that `typeId` if you create a new element through the tool palette in the `Create*Operation`. Consequently, the `CreateNodeOperation` has the `typeId` and the `position` of the mouse in the graph.

Here, you map the `CreateNodeOperation` + `UmlDemo_Artifact.typeId()` to the `CreateArtifactContribution`.

Now the UML-GLSP-Server will send the `CreateArtifactContribution` to the UML-ModelServer if it receives the correct `typeId` and the `component` diagram is open.

#### GS-Step4: Important

- You need to export your `CreateArtifactContribution`. The icon in the left by the line number can do this. Click on it and then on export. Afterward, you can import it.
- There are different base classes like `BaseCreateChildNodeHandler` to make our lives easier. Go find them. :)

### GS-Step 5: Binding everything

Open the file `DemoManifest.java`.

- path: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/uml/diagram/demo_diagram/manifest/DemoManifest.java`

Implement the interface `DiagramCreateHandlerContribution`. The other contributions (e.g., `DiagramElementConfigurationContribution`, `ToolPaletteConfigurationContribution`, `GModelMapperContribution`) are already implemented by the base class `DiagramManifest`, so can use the methods directly.

Extend the `configure` method as follows:

```java
   @Override
   protected void configure() {
      super.configure();

      contributeDiagramElementConfiguration((nodes) -> {
         nodes.addBinding().to(UmlDemo_Artifact.DiagramConfiguration.class);
      }, (edges) -> {});

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(DemoToolPaletteConfiguration.class);
      });

      contributeGModelMappers((contributions) -> {
         contributions.addBinding().to(ArtifactNodeMapper.class);
      });

      contributeDiagramCreateHandlers((contribution) -> {
         contribution.addBinding().to(CreateArtifactHandler.class);
      });
   }
```

You need to bind all the classes you have created previously. You are now contributing your classes to the core package.

Now the UML-GLSP-Server is also ready.

#### GS-Step5: Important

- There are different contributions. You can check them out in the `core` package.
- You have to make sure that you bind YOUR class and not someone else's; otherwise, you will have a hard time figuring out why it does not work.
- Every class you define needs to be used somehow, so you probably need to bind it.

---

## UML-Client

The final step is to register the `Artifact` in the client.

### CL-Step1: Create the types

Create the following `TypeScript` file:

- Name: `demo.types.ts`
- Path: `packages/uml-glsp/src/uml/diagram/demo/demo.types.ts` (create folders if necessary)

Put the following content into the file.

```ts
import { UmlDiagramType } from "@borkdominik-biguml/uml-common";
import { DefaultTypes } from "@eclipse-glsp/client";
import { QualifiedUtil } from "../../qualified.utils";

export namespace UmlDemoTypes {
  export const ARTIFACT = QualifiedUtil.representationTypeId(
    UmlDiagramType.COMPONENT,
    DefaultTypes.NODE,
    "Artifact"
  );
}
```

This file is the opposite of the `UmlDemo_Artifact.java`. The variable `ARTIFACT` needs to have the same `typeId` as in the server.

### CL-Step2: Bind the type

Open the file `di.config.ts`

- Path: `packages/uml-glsp/src/uml/diagram/demo/di.config.ts`

Put the following content into the file.

```ts
import { configureModelElement } from "@eclipse-glsp/client";
import { ContainerModule } from "inversify";
import { NamedElement } from "../../elements/named-element.model";
import { NamedElementView } from "../../elements/named-element.view";
import { UmlDemoTypes } from "./demo.types";

export const umlDemoDiagramModule = new ContainerModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    configureModelElement(
      context,
      UmlDemoTypes.ARTIFACT,
      NamedElement,
      NamedElementView
    );
  }
);
```

This file now binds our `UmlDemoTypes.ARTIFACT` with the model `NamedElement` and together with the view `NamedElementView`

Now start the servers and either Theia or VSCode and create your diagram with `File -> New File` or `File -> New UML Diagram`.

#### CL-Step2: Important

- `umlDemoDiagramModule` is the module where you put all of your bindings.
- The third (e.g., `NamedElement`) and fourth (e.g., `NamedElementView`) parameters of `configureModelElement` define how the element should be rendered.
- `NamedElement` is a subtype of `GNode`. Do you remember that we said that the `Artifact` should be mapped to a `GNode`?
- `NamedElementView` is the view that renders into an SVG.
- You can create custom views by changing the view part in the binding.
- Read the GLSP documentation for more.

### CL-Step3: Extend supported diagrams

Open the file `language.ts`

- Path: `packages/uml-common/src/language/language.ts`

Update the variable `supported` to have your diagram in it.

```ts
export const supported: UmlDiagramType[] = [
  UmlDiagramType.CLASS,
  UmlDiagramType.COMMUNICATION,
  UmlDiagramType.COMPONENT, // <-- Here
];
```

Now start the servers and either Theia or VSCode and create your diagram with `File -> New File` or `File -> New UML Diagram`.
