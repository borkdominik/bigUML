# Creating nodes

Here we will learn how to create nodes. This tutorial is the follow-up of [Preparations](./0_Preparations.md).

---

The UML-ModelServer creates (and also updates, deletes, and more) the source models. Therefore we now need to implement the logic for it. The logic for such operations is put into `command` classes. A `command` is an operation that changes the source model.

The UML-GLSP-Server afterward uses those `commands` to trigger a change caused by an action.

In this tutorial, we will also learn how to

- prepare GLSP to work with the model server
- draw elements in the diagram

## UML-ModelServer

### ML-Step 1: Creating the semantic command

Create the following `Java Class` file:

- Name: `CreateCollaborationSemanticCommand`
- Path: `/com.eclipsesource.uml.modelserver/src/main/java/com/eclipsesource/uml/modelserver/uml/diagram/demo/commands/collaboration/CreateCollaborationSemanticCommand.java` (create packages if necessary)

Put the following content into the file.

```java
package com.eclipsesource.uml.modelserver.uml.diagram.demo.commands.collaboration;

import org.eclipse.uml2.uml.Collaboration;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreateCollaborationSemanticCommand extends BaseCreateSemanticChildCommand<Model, Collaboration> {

   public CreateCollaborationSemanticCommand(final ModelContext context, final Model parent) {
      super(context, parent);
   }

   @Override
   protected Collaboration createSemanticElement(final Model parent) {
      var nameGenerator = new ListNameGenerator(Collaboration.class, parent.getPackagedElements());

      var collaboration = UMLFactory.eINSTANCE.createCollaboration();
      collaboration.setName(nameGenerator.newName());
      parent.getPackagedElements().add(collaboration);

      return collaboration;
   }

}
```

Here some interesting things happen. First, our command extends `BaseCreateSemanticChildCommand`. This base class makes our lives easier by abstracting everything away we don't need to know. Further, we say that we expect that our parent is the `Model` itself and that we will create a `Collaboration` object with our command. In the `createSemanticElement` method, we create our object, assign a new name, and then add it to our parent. The result is then returned for further use.

#### MS-Step1: Important Knowledge

- Every element has a parent. Therefore, find out about your element (i.e., use papyrus), then implement.
- You could hardcode the name, but `ListNameGenerator` generates a new name for us (it appends a number to the end)
- The same approach also applies to deleting and updating. They just have different base classes and do something different. Go and find the base classes for them.

### ML-Step 2: Creating the compound command

Create the following `Java Class` file:

- Name: `CreateCollaborationCompoundCommand`
- Path: `/com.eclipsesource.uml.modelserver/src/main/java/com/eclipsesource/uml/modelserver/uml/diagram/demo/commands/collaboration/CreateCollaborationCompoundCommand.java` (create packages if necessary)

Put the following content into the file.

```java
package com.eclipsesource.uml.modelserver.uml.diagram.demo.commands.collaboration;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;

public final class CreateCollaborationCompoundCommand extends CompoundCommand {

   public CreateCollaborationCompoundCommand(final ModelContext context, final Model parent,
      final GPoint position) {
      var command = new CreateCollaborationSemanticCommand(context, parent);

      this.append(command);
      this.append(
         new AddShapeNotationCommand(context, command::getSemanticElement, position, GraphUtil.dimension(160, 50)));
   }
}
```

Whereas the semantic command creates the object itself, the `CompoundCommand` defines all the commands that should execute. Here we see that we want to execute `CreateCollaborationSemanticCommand`, which will create our `Collaboration`, and we also want to execute `AddShapeNotationCommand`. This command is provided by bigUML, and it generates the shape structure for our `Collaboration`. The shape has meta information like the element's position or size. The former is called the semantic, and the latter the notation of an element. In other words, we now execute two commands - namely, create the semantic and the notation of a `Collaboration` object.

#### MS-Step2: Important Knowledge

- Sometimes, the `CompoundCommand` can be skipped. Such cases are, for example, if you just want to execute a single command. Can you think about such a case?

### ML-Step 3: Creating the command contribution

Create the following `Java Class` file:

- Name: `CreateCollaborationContribution`
- Path: `/com.eclipsesource.uml.modelserver/src/main/java/com/eclipsesource/uml/modelserver/uml/diagram/demo/commands/collaboration/CreateCollaborationContribution.java` (create packages if necessary)

Put the following content into the file.

```java
package com.eclipsesource.uml.modelserver.uml.diagram.demo.commands.collaboration;

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

public final class CreateCollaborationContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "composite:add_collaboration";

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
         .<Command> map(p -> new CreateCollaborationCompoundCommand(context, p, position))
         .orElse(new NoopCommand());
   }

}
```

A `CommandContribution` (not the same as a `manifest contribution`) is the glue code between UML-GLSP-Server and the UML-ModelServer. We need to investigate two parts.

The static `create` method will be called by UML-GLSP-Server. We create a request and encode it (see `ContributionEncoder`). The encoder uses the `type`, `position`, and `parent` to create a unique request. Therefore it is **important** that the `type` is unique! The `type` is used to map the request correctly. The encoded command will be transferred from the UML-GLSP-Server to the UML-ModelServer.

The incoming request is then decoded in `toServer` with `ContributionDecoder`. We then read the content of our request (e.g., the `parent`, `position`) and execute our `CreateCollaborationCompoundCommand`.

#### MS-Step3: Important Knowledge

- We encode our requests, send them, decode them, and execute our commands.
- The encoder and decoder have more methods; check them out.
- As visible, we create a plain object (`CreateCollaborationCompoundCommand`). Therefore the commands do **not** have access to dependency injection.

### ML-Step 4: Bind the Command Contribution

Open the file `DemoManifest.java`.

- path: `/com.eclipsesource.uml.modelserver/src/main/java/com/eclipsesource/uml/modelserver/uml/diagram/demo/manifest/DemoManifest.java`

Implement the interface `CommandCodecContribution` and extend the method to be like

```java
   @Override
   protected void configure() {
      super.configure();
      contributeCommandCodec(binder(), (contributions) -> {
        contributions.addBinding(CreateCollaborationContribution.TYPE).to(CreateCollaborationContribution.class);
      });
   }
```

By implementing the interface, we say that our manifest wants to make a `CommandCodecContribution`. The implementation allows us to use the method `contributeCommandCodec`. This method takes the `binder()` (dependency injection) and binds our `CreateCollaborationContribution` to the correct place.

Now, our UML-ModelServer is ready to listen to `commands`. If a `command` of type `CreateCollaborationContribution.TYPE` arrives, the core will map it to the correct place (== `CreateCollaborationContribution`). There, we will create our child `commands`, and they will create the semantics and notation of our `Collaboration`.

#### MS-Step4: Important Knowledge

- `Contributions` (e.g., `CommandCodecContribution`) are interfaces that provide a default implementation. The default implementation setups in the background the necessary bindings so that you only have to provide your _Classes_. Everything else is done for you.
- Again, `Command Contributions` are different from `Manifest Contributions`.
