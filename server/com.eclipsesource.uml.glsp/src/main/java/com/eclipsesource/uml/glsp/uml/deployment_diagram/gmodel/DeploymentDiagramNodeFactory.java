package com.eclipsesource.uml.glsp.uml.deployment_diagram.gmodel;

public class DeploymentDiagramNodeFactory { /*-

   private final DeploymentDiagramFactory parentFactory;

   private static final String V_GRAB = "vGrab";
   private static final String H_GRAB = "hGrab";
   private static final String H_ALIGN = "hAlign";

   public DeploymentDiagramNodeFactory(final UmlModelState modelState, final DeploymentDiagramFactory parentFactory) {
      super(modelState);
      this.parentFactory = parentFactory;
   }

   @Override
   public GNode create(final Classifier classifier) {
      if (classifier instanceof DeploymentSpecification) {
         return createDeploymentSpecification((DeploymentSpecification) classifier);
      } else if (classifier instanceof Device) {
         return createDevice((Device) classifier);
      } else if (classifier instanceof ExecutionEnvironment) {
         return createExecutionEnvironment((ExecutionEnvironment) classifier);
      } else if (classifier instanceof Node) {
         return createNode((Node) classifier);
      } else if (classifier instanceof Artifact) {
         return createArtifact((Artifact) classifier);
      }
      return null;
   }

   protected GNode createDeploymentSpecification(final DeploymentSpecification deploymentSpecification) {
      GNodeBuilder b = new GNodeBuilder(DeploymentTypes.DEPLOYMENT_SPECIFICATION)
         .id(toId(deploymentSpecification))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CSS.NODE)
         .add(buildDeploymentSpecificationHeader(deploymentSpecification));

      applyShapeData(deploymentSpecification, b);
      return b.build();
   }

   protected GNode createNode(final Node umlNode) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.CENTER);
      layoutOptions.put(H_GRAB, false);
      layoutOptions.put(V_GRAB, false);

      GNodeBuilder builder = new GNodeBuilder(DeploymentTypes.DEPLOYMENT_NODE)
         .id(toId(umlNode))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(layoutOptions)
         .add(buildHeader(umlNode))
         .addCssClass(CSS.NODE)
         .addCssClass(CSS.PACKAGEABLE_NODE);

      applyShapeData(umlNode, builder);

      GNode deploymentNodeNode = builder.build();

      GCompartment structureCompartment = createStructureCompartment(umlNode);

      List<GModelElement> childNodes = umlNode.getNestedClassifiers().stream()
         .filter(Node.class::isInstance)
         .map(Node.class::cast)
         .map(this::createNode)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childNodes);

      List<GModelElement> childDevices = umlNode.getNestedClassifiers().stream()
         .filter(Device.class::isInstance)
         .map(Device.class::cast)
         .map(this::createDevice)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childDevices);

      List<GModelElement> childExecutionEnvironments = umlNode.getNestedClassifiers().stream()
         .filter(ExecutionEnvironment.class::isInstance)
         .map(ExecutionEnvironment.class::cast)
         .map(this::createExecutionEnvironment)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childExecutionEnvironments);

      List<GModelElement> childDeploymentSpecifications = umlNode.getNestedClassifiers().stream()
         .filter(DeploymentSpecification.class::isInstance)
         .map(DeploymentSpecification.class::cast)
         .map(this::createDeploymentSpecification)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childDeploymentSpecifications);

      List<GModelElement> childArtifacts = umlNode.getNestedClassifiers().stream()
         .filter(Artifact.class::isInstance)
         .map(Artifact.class::cast)
         .map(this::createArtifact)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childArtifacts);

      deploymentNodeNode.getChildren().add(structureCompartment);
      return deploymentNodeNode;

      /*
       * List<EObject> nodeChildren = new ArrayList<>(umlNode.getOwnedElements());
       * GNodeBuilder b = new GNodeBuilder(DeploymentTypes.DEPLOYMENT_NODE)
       * .id(toId(umlNode))
       * .layout(GConstants.Layout.VBOX)
       * .addCssClass(CSS.NODE)
       * .add(buildHeader(umlNode))
       * .add(createLabeledChildCompartment(nodeChildren, umlNode));
       * applyShapeData(umlNode, b);
       * return b.build();
       *
   }

   protected GNode createArtifact(final Artifact artifact) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.CENTER);
      layoutOptions.put(H_GRAB, false);
      layoutOptions.put(V_GRAB, false);

      GNodeBuilder builder = new GNodeBuilder(DeploymentTypes.ARTIFACT)
         .id(toId(artifact))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(layoutOptions)
         .add(buildHeader(artifact))
         .addCssClass(CSS.NODE)
         .addCssClass(CSS.PACKAGEABLE_NODE);

      applyShapeData(artifact, builder);

      GNode artifactNode = builder.build();

      GCompartment structureCompartment = createStructureCompartment(artifact);

      List<GModelElement> childDeploymentSpecifications = artifact.getOwnedMembers().stream()
         .filter(DeploymentSpecification.class::isInstance)
         .map(DeploymentSpecification.class::cast)
         .map(this::createDeploymentSpecification)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childDeploymentSpecifications);

      artifactNode.getChildren().add(structureCompartment);
      return artifactNode;

      /*
       * List<EObject> artifactChildren = new ArrayList<>(artifact.getNestedArtifacts());
       * GNodeBuilder b = new GNodeBuilder(DeploymentTypes.ARTIFACT)
       * .id(toId(artifact))
       * .layout(GConstants.Layout.VBOX)
       * .addCssClass(CSS.NODE)
       * .add(buildHeader(artifact))
       * .add(createLabeledChildCompartment(artifactChildren, artifact));
       * ArrayList<Classifier> childElements = new ArrayList<>();
       * childElements.addAll(artifact.getNestedArtifacts().stream()
       * .filter(pe -> (pe instanceof DeploymentSpecification))
       * .map(Classifier.class::cast)
       * .collect(Collectors.toList()));
       * applyShapeData(artifact, b);
       * return b.build();
       *
   }

   protected GNode createDevice(final Device device) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.CENTER);
      layoutOptions.put(H_GRAB, false);
      layoutOptions.put(V_GRAB, false);

      GNodeBuilder builder = new GNodeBuilder(DeploymentTypes.DEVICE)
         .id(toId(device))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(layoutOptions)
         .add(buildHeader(device))
         .addCssClass(CSS.NODE)
         .addCssClass(CSS.PACKAGEABLE_NODE);

      applyShapeData(device, builder);

      GNode deviceNode = builder.build();

      GCompartment structureCompartment = createStructureCompartment(device);

      // FIXME: why is it needed for those to be added as child node and the others work without this step!?!?!?
      List<GModelElement> childDevices = device.getNestedClassifiers().stream()
         .filter(Device.class::isInstance)
         .map(Device.class::cast)
         .map(this::createDevice)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childDevices);

      List<GModelElement> childArtifacts = device.getNestedClassifiers().stream()
         .filter(Artifact.class::isInstance)
         .map(Artifact.class::cast)
         .map(this::createArtifact)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childArtifacts);

      List<GModelElement> childNodes = device.getNestedClassifiers().stream()
         .filter(Node.class::isInstance)
         .map(Node.class::cast)
         .map(this::createNode)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childNodes);

      // TODO: move component into here and delete child node factory
      /*
       * List<GModelElement> childComponents = device.getNestedClassifiers().stream()
       * .filter(Component.class::isInstance)
       * .map(Component.class::cast)
       * .map(this::TODODODODODODOD)
       * .collect(Collectors.toList());
       * structureCompartment.getChildren().addAll(childComponents);
       */

   // TODO: check why this is NOT working!!! might be the modelserver config!!!
   /*
    * List<GModelElement> childExecutionEnvironments = device.getNestedClassifiers().stream()
    * .filter(ExecutionEnvironment.class::isInstance)
    * .map(ExecutionEnvironment.class::cast)
    * .map(this::createExecutionEnvironment)
    * .collect(Collectors.toList());
    * structureCompartment.getChildren().addAll(childExecutionEnvironments);
    * // TODO: check why this is working
    * List<GModelElement> childDeploymentSpecifications = device.getNestedClassifiers().stream()
    * .filter(DeploymentSpecification.class::isInstance)
    * .map(DeploymentSpecification.class::cast)
    * .map(this::createDeploymentSpecification)
    * .collect(Collectors.toList());
    * structureCompartment.getChildren().addAll(childDeploymentSpecifications);
    * deviceNode.getChildren().add(structureCompartment);
    * return deviceNode;
    * }
    * // FIXME: also creates a device node somehow!!! check later again
    * protected GNode createExecutionEnvironment(final ExecutionEnvironment executionEnvironment) {
    * Map<String, Object> layoutOptions = new HashMap<>();
    * layoutOptions.put(H_ALIGN, GConstants.HAlign.CENTER);
    * layoutOptions.put(H_GRAB, false);
    * layoutOptions.put(V_GRAB, false);
    * GNodeBuilder builder = new GNodeBuilder(DeploymentTypes.EXECUTION_ENVIRONMENT)
    * .id(toId(executionEnvironment))
    * .layout(GConstants.Layout.VBOX)
    * .layoutOptions(layoutOptions)
    * .add(buildHeader(executionEnvironment))
    * .addCssClass(CSS.NODE)
    * .addCssClass(CSS.PACKAGEABLE_NODE);
    * applyShapeData(executionEnvironment, builder);
    * GNode executionEnvironmentNode = builder.build();
    * GCompartment structureCompartment = createStructureCompartment(executionEnvironment);
    * List<GModelElement> childNodes = executionEnvironment.getNestedClassifiers().stream()
    * .filter(Node.class::isInstance)
    * .map(Node.class::cast)
    * .map(this::createNode)
    * .collect(Collectors.toList());
    * structureCompartment.getChildren().addAll(childNodes);
    * List<GModelElement> childDevices = executionEnvironment.getNestedClassifiers().stream()
    * .filter(Device.class::isInstance)
    * .map(Device.class::cast)
    * .map(this::createDevice)
    * .collect(Collectors.toList());
    * structureCompartment.getChildren().addAll(childDevices);
    * List<GModelElement> childExecutionEnvironments = executionEnvironment.getNestedClassifiers().stream()
    * .filter(ExecutionEnvironment.class::isInstance)
    * .map(ExecutionEnvironment.class::cast)
    * .map(this::createExecutionEnvironment)
    * .collect(Collectors.toList());
    * structureCompartment.getChildren().addAll(childExecutionEnvironments);
    * List<GModelElement> childDeploymentSpecifications = executionEnvironment.getNestedClassifiers().stream()
    * .filter(DeploymentSpecification.class::isInstance)
    * .map(DeploymentSpecification.class::cast)
    * .map(this::createDeploymentSpecification)
    * .collect(Collectors.toList());
    * structureCompartment.getChildren().addAll(childDeploymentSpecifications);
    * List<GModelElement> childArtifacts = executionEnvironment.getNestedClassifiers().stream()
    * .filter(Artifact.class::isInstance)
    * .map(Artifact.class::cast)
    * .map(this::createArtifact)
    * .collect(Collectors.toList());
    * structureCompartment.getChildren().addAll(childArtifacts);
    * executionEnvironmentNode.getChildren().add(structureCompartment);
    * return executionEnvironmentNode;
    * /*
    * List<EObject> executionEnvironmentChildren = new ArrayList<>(executionEnvironment.getOwnedElements());
    * GNodeBuilder b = new GNodeBuilder(DeploymentTypes.EXECUTION_ENVIRONMENT)
    * .id(toId(executionEnvironment))
    * .layout(GConstants.Layout.VBOX)
    * .addCssClass(CSS.NODE)
    * .add(buildHeader(executionEnvironment))
    * .add(createLabeledChildCompartment(executionEnvironmentChildren, executionEnvironment));
    * applyShapeData(executionEnvironment, b);
    * return b.build();
    * }
    * protected void applyShapeData(final Classifier classifier, final GNodeBuilder builder) {
    * modelState.getIndex().getNotation(classifier, Shape.class).ifPresent(shape -> {
    * if (shape.getPosition() != null) {
    * builder.position(GraphUtil.copy(shape.getPosition()));
    * }
    * if (shape.getSize() != null) {
    * builder.size(GraphUtil.copy(shape.getSize()));
    * }
    * });
    * }
    * protected GCompartment buildDeploymentSpecificationHeader(final DeploymentSpecification
    * umlDeploymentSpecification) {
    * return new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER)
    * .layout("vbox")
    * .id(toId(umlDeploymentSpecification) + "_header")
    * .add(new GLabelBuilder(UmlConfig.Types.LABEL_TEXT)
    * .id(toId(umlDeploymentSpecification) + "_header_text")
    * .text("«deployment_spec»")
    * .build())
    * .add(new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER) //
    * .layout("hbox") //
    * /*
    * .add(new GCompartmentBuilder(getType(umlDeploymentSpecification)) //
    * .id(toId(umlDeploymentSpecification) + "_header_icon").build()) //
    * .add(new GLabelBuilder(UmlConfig.Types.LABEL_NAME) //
    * .id(toId(umlDeploymentSpecification) + "_header_label").text(umlDeploymentSpecification.getName()) //
    * .build())
    * .build())
    * .build();
    * }
    * protected GCompartment buildHeader(final Node umlNode) {
    * return new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER) //
    * .layout("hbox") //
    * .id(toId(umlNode) + "_header")
    * .add(new GCompartmentBuilder(getType(umlNode)) //
    * // .id(toId(umlNode) + "_header_icon")
    * .build()) //
    * .add(new GLabelBuilder(UmlConfig.Types.LABEL_NAME) //
    * .id(toId(umlNode) + "_header_label").text(umlNode.getName()) //
    * .build()) //
    * .build();
    * }
    * protected GCompartment buildHeader(final Artifact umlArtifact) {
    * GCompartmentBuilder artifactHeader = new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER)
    * .layout(GConstants.Layout.VBOX)
    * .id(UmlIDUtil.createHeaderId(toId(umlArtifact)));
    * GLabel typeLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
    * .id(UmlIDUtil.createHeaderLabelId(toId(umlArtifact)) + "_type_header")
    * .text("«artifact»")
    * .build();
    * artifactHeader.add(typeLabel);
    * GLabel artifactLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
    * .id(UmlIDUtil.createHeaderLabelId(toId(umlArtifact)))
    * .text(umlArtifact.getName())
    * .build();
    * artifactHeader.add(artifactLabel);
    * return artifactHeader.build();
    * }
    * protected GCompartment buildHeader(final ExecutionEnvironment umlExecutionEnvironment) {
    * GCompartmentBuilder executionEnvironmentHeader = new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER)
    * .layout(GConstants.Layout.VBOX)
    * .id(UmlIDUtil.createHeaderId(toId(umlExecutionEnvironment)));
    * GLabel typeLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
    * .id(UmlIDUtil.createHeaderLabelId(toId(umlExecutionEnvironment)) + "_type_header")
    * .text("«execution_environment»")
    * .build();
    * executionEnvironmentHeader.add(typeLabel);
    * GLabel executionEnvironmentLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
    * .id(UmlIDUtil.createHeaderLabelId(toId(umlExecutionEnvironment)))
    * .text(umlExecutionEnvironment.getName())
    * .build();
    * executionEnvironmentHeader.add(executionEnvironmentLabel);
    * return executionEnvironmentHeader.build();
    * }
    * protected GCompartment buildHeader(final Device umlDevice) {
    * GCompartmentBuilder deviceHeader = new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER)
    * .layout(GConstants.Layout.VBOX)
    * .id(UmlIDUtil.createHeaderId(toId(umlDevice)));
    * /*
    * GCompartment deviceIcon = new GCompartmentBuilder(getType(umlDevice))
    * .id(UmlIDUtil.createHeaderIconId(toId(umlDevice)))
    * .build();
    * deviceHeader.add(deviceIcon);
    * GLabel typeLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
    * .id(UmlIDUtil.createHeaderLabelId(toId(umlDevice)) + "_type_header")
    * .text("«device»")
    * .build();
    * deviceHeader.add(typeLabel);
    * GLabel deviceLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
    * .id(UmlIDUtil.createHeaderLabelId(toId(umlDevice)))
    * .text(umlDevice.getName())
    * .build();
    * deviceHeader.add(deviceLabel);
    * return deviceHeader.build();
    * }
    * protected GCompartment createLabeledChildCompartment(final Collection<? extends EObject> children,
    * final Node parent) {
    * return new GCompartmentBuilder(UmlConfig.Types.COMP) //
    * .id(toId(parent) + "_childCompartment").layout(GConstants.Layout.VBOX) //
    * .layoutOptions(new GLayoutOptions() //
    * .hAlign(GConstants.HAlign.CENTER) //
    * .resizeContainer(true)) //
    * .addAll(children.stream() //
    * .map(parentFactory::create) //
    * .collect(Collectors.toList()))
    * .build();
    * }
    * protected GCompartment createLabeledChildCompartment(final Collection<? extends EObject> children,
    * final Artifact parent) {
    * return new GCompartmentBuilder(UmlConfig.Types.COMP) //
    * .id(toId(parent) + "_childCompartment").layout(GConstants.Layout.VBOX) //
    * .layoutOptions(new GLayoutOptions() //
    * .hAlign(GConstants.HAlign.CENTER) //
    * .resizeContainer(true)) //
    * .addAll(children.stream() //
    * .map(parentFactory::create) //
    * .collect(Collectors.toList()))
    * .build();
    * }
    * protected GCompartment createLabeledChildCompartment(final Collection<? extends EObject> children,
    * final Device parent) {
    * return new GCompartmentBuilder(UmlConfig.Types.COMP) //
    * .id(toId(parent) + "_childCompartment").layout(GConstants.Layout.VBOX) //
    * .layoutOptions(new GLayoutOptions() //
    * .hAlign(GConstants.HAlign.CENTER) //
    * .resizeContainer(true)) //
    * .addAll(children.stream() //
    * .map(parentFactory::create) //
    * .collect(Collectors.toList()))
    * .build();
    * }
    * protected GCompartment createLabeledChildCompartment(final Collection<? extends EObject> children,
    * final ExecutionEnvironment parent) {
    * return new GCompartmentBuilder(UmlConfig.Types.COMP) //
    * .id(toId(parent) + "_childCompartment").layout(GConstants.Layout.VBOX) //
    * .layoutOptions(new GLayoutOptions() //
    * .hAlign(GConstants.HAlign.CENTER) //
    * .resizeContainer(true)) //
    * .addAll(children.stream() //
    * .map(parentFactory::create) //
    * .collect(Collectors.toList()))
    * .build();
    * }
    * private GCompartment createStructureCompartment(final NamedElement namedElement) {
    * Map<String, Object> layoutOptions = new HashMap<>();
    * layoutOptions.put(H_ALIGN, GConstants.HAlign.LEFT);
    * layoutOptions.put(H_GRAB, true);
    * layoutOptions.put(V_GRAB, true);
    * GCompartment structCompartment = new GCompartmentBuilder(DeploymentTypes.STRUCTURE)
    * .id(toId(namedElement) + "_struct")
    * .layout(GConstants.Layout.FREEFORM)
    * .layoutOptions(layoutOptions)
    * .addCssClass("struct")
    * .build();
    * return structCompartment;
    * }
    * protected static String getType(final Classifier classifier) {
    * if (classifier instanceof DeploymentSpecification) {
    * return DeploymentTypes.ICON_DEPLOYMENT_SPECIFICATION;
    * }
    * if (classifier instanceof Artifact) {
    * return DeploymentTypes.ICON_ARTIFACT;
    * }
    * if (classifier instanceof ExecutionEnvironment) {
    * return DeploymentTypes.ICON_EXECUTION_ENVIRONMENT;
    * }
    * if (classifier instanceof Device) {
    * return DeploymentTypes.ICON_DEVICE;
    * }
    * if (classifier instanceof Node) {
    * return DeploymentTypes.ICON_DEPLOYMENT_NODE;
    * }
    * return "Classifier not found";
    * }
    */
}
