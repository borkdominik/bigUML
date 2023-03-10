# Preparations

This tutorial gives a detailed description of how to create UML modules and how to provide those modules to the core package. Here we will create a `demo` module, which will be the basis for our other tutorials.

---

We always start with the `UML-ModelServer`, continue with the `UML-GLSP-Server`, and finish at the `UML-Client`.

The reason is simple. The model server manages the source files. Therefore, we need to define the commands which will be used later. But first, we need modules.

## UML-ModelServer

### MS-Step 1: Creation of DemoManifest

Create the following `Java Class` file:

- Name: `DemoManifest`
- Path: `/com.eclipsesource.uml.modelserver/src/main/java/com/eclipsesource/uml/modelserver/uml/diagram/demo_diagram/manifest/DemoManifest.java` (create packages if necessary)

Put the following content into the file.

```java
package com.eclipsesource.uml.modelserver.uml.diagram.demo_diagram.manifest;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;

public class DemoManifest extends DiagramManifest {
   @Override
   protected void configure() {
      super.configure();
   }
}
```

The `Class` does not do much, but that will change later.

#### MS-Step1: Important Knowledge

- Manifests extend a predefined base manifest (e.g., `DiagramManifest`).
- You will provide your custom implementations to the' core' package here (in the next tutorials) through a `Contribution`.

### MS-Step 2: Installing the DemoManifest in core

Open the file `UmlModelServerModule.java`.

- path: `/com.eclipsesource.uml.modelserver/src/main/java/com/eclipsesource/uml/modelserver/core/UmlModelServerModule.java`

In the method `configure()`, you need to install your `DemoManifest`.

```java
   @Override
   protected void configure() {
      super.configure();
      ...
      install(new DemoManifest()); // <-- Here
   }
```

This was it! Your module is now connected with the core package, and you can now use contribution points in your manifest.

#### MS-Step2: Important Knowledge

- The `UmlModelServerModule.java` is the root container that manages all the dependencies in the model server.

---

## UML-GLSP-Server

### GS-Step 1: Creation of DemoManifest

Create the following `Java Class` file:

- Name: `DemoManifest`
- Path: `/com.eclipsesource.uml.modelserver/src/main/java/com/eclipsesource/uml/modelserver/uml/diagram/demo_diagram/manifest/DemoManifest.java` (create packages if necessary)

Put the following content into the file.

```java
package com.eclipsesource.uml.glsp.uml.diagram.demo_diagram.manifest;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class DemoManifest extends DiagramManifest {

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.COMPONENT;
   }

   @Override
   protected void configure() {
      super.configure();
   }
}
```

Every manifest in GLSP has an id and also a representation. Both of those are necessary to differentiate between the UML modules. Here we say the `DemoManifest` should represent the _composite_ diagram.

#### GS-Step1: Important Knowledge

- Manifests extend a predefined base manifest (e.g., `DiagramManifest`).
- You will provide your custom implementations to the' core' package here (in the next tutorials) through a `Contribution`.

### GS-Step 2: Installing the DemoManifest in core

Open the file `UmlDiagramModule.java`.

- path: `/com.eclipsesource.uml.glsp/src/main/java/com/eclipsesource/uml/glsp/core/UmlDiagramModule.java`

In the method `configureAdditionals()`, you need to install your `DemoManifest`.

```java
   @Override
   protected void configureAdditionals() {
      super.configure();
      ...
      install(new DemoManifest()); // <-- Here
   }
```

This was it! Your module is now connected with the core package, and you can now use contribution points in your manifest.

#### GS-Step2: Important Knowledge

- The `UmlDiagramModule.java` is the root container that manages all the dependencies in the model server.

---

## UML-Client

### CL-Step 1: Creation of DemoDiagramModule

Create the following `TypeScript` file:

- Name: `di.config.ts`
- Path: `packages/uml-glsp/src/uml/diagram/demo/di.config.ts` (create folders if necessary)

Put the following content into the file.

```ts
import { ContainerModule } from "inversify";

export const umlDemoDiagramModule = new ContainerModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
  }
);
```

Currently, the `module` does not do much, but that will change later.

#### CL-Step1: Important Knowledge

- Client-side you do not have manifests. You work directly with dependency injection, meaning you will bind your elements later.

### GL-Step 2: Loading the DemoDiagramModule

Open the file `index.ts`.

- path: `packages/uml-glsp/src/uml/index.ts`

Here add your module to the end of `umlDiagramModules`.

```ts
export const umlDiagramModules = [
  umlModule,
  umlClassDiagramModule,
  umlCommunicationDiagramModule,
  umlDemoDiagramModule,
];
```

This was it! Your module is now connected with the root module.

#### CL-Step2: Important Knowledge

- The list `umlDiagramModules` is just a helper variable. This variable is used in `packages/uml-glsp/src/di.config.ts` to load all diagram modules.

## Summary

All your modules are now ready; you need to start extending them :)

Next tutorial is [Creating Nodes](./1_CreatingNodes.md)
