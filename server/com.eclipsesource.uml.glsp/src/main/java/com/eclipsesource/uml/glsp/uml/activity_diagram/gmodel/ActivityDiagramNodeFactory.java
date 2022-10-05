package com.eclipsesource.uml.glsp.uml.activity_diagram.gmodel;

public class ActivityDiagramNodeFactory { /*-

   private final ActivityDiagramFactory parentFactory;
   private final ActivityDiagramChildNodeFactory activityDiagramChildNodeFactory;

   private static final String V_GRAB = "vGrab";
   private static final String H_GRAB = "hGrab";
   private static final String H_ALIGN = "hAlign";

   public ActivityDiagramNodeFactory(final UmlModelState modelState,
      final ActivityDiagramFactory parentFactory,
      final ActivityDiagramChildNodeFactory activityDiagramChildNodeFactory) {
      super(modelState);
      this.parentFactory = parentFactory;
      this.activityDiagramChildNodeFactory = activityDiagramChildNodeFactory;
   }

   @Override
   public GNode create(final Classifier classifier) {
      if (classifier instanceof Activity) {
         return create((Activity) classifier);
      }
      return null;
   }

   // ACTIVITY
   protected GNode create(final Activity umlActivity) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.CENTER);
      layoutOptions.put(H_GRAB, true);
      layoutOptions.put(V_GRAB, true);

      GNodeBuilder builder = new GNodeBuilder(ActivityTypes.ACTIVITY)
         .id(toId(umlActivity))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(layoutOptions)
         .add(buildActivityHeader(umlActivity))
         .addCssClass(CSS.NODE)
         .addCssClass(CSS.PACKAGEABLE_NODE);

      applyShapeData(umlActivity, builder);

      GNode activityNode = builder.build();

      GCompartment structureCompartment = createStructureCompartment(umlActivity);

      List<GModelElement> childPartitions = umlActivity.getGroups().stream()
         .filter(ActivityPartition.class::isInstance)
         .map(ActivityPartition.class::cast)
         .map(parentFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childPartitions);

      List<GModelElement> childInterruptibleRegion = umlActivity.getGroups().stream()
         .filter(InterruptibleActivityRegion.class::isInstance)
         .map(InterruptibleActivityRegion.class::cast)
         .map(parentFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childInterruptibleRegion);

      List<GModelElement> childActions = umlActivity.getOwnedNodes().stream()
         .filter(OpaqueAction.class::isInstance)
         .map(OpaqueAction.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childActions);

      List<GModelElement> childSendSignalActions = umlActivity.getOwnedNodes().stream()
         .filter(SendSignalAction.class::isInstance)
         .map(SendSignalAction.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childSendSignalActions);

      List<GModelElement> childCallActions = umlActivity.getOwnedNodes().stream()
         .filter(CallBehaviorAction.class::isInstance)
         .map(CallBehaviorAction.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childCallActions);

      List<GModelElement> childEvents = umlActivity.getOwnedNodes().stream()
         .filter(AcceptEventAction.class::isInstance)
         .map(AcceptEventAction.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childEvents);

      List<GModelElement> childParameters = umlActivity.getOwnedNodes().stream()
         .filter(ActivityParameterNode.class::isInstance)
         .map(ActivityParameterNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childParameters);

      List<GModelElement> childConditions = umlActivity.getOwnedNodes().stream()
         .filter(Constraint.class::isInstance)
         .map(Constraint.class::cast)
         .map(this::createConditionNode)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childConditions);

      List<GModelElement> childCentralBufferNodes = umlActivity.getOwnedNodes().stream()
         .filter(CentralBufferNode.class::isInstance)
         .map(CentralBufferNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childCentralBufferNodes);

      List<GModelElement> childDataStoreNodes = umlActivity.getOwnedNodes().stream()
         .filter(DataStoreNode.class::isInstance)
         .map(DataStoreNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childDataStoreNodes);

      List<GModelElement> childInitialNodes = umlActivity.getOwnedNodes().stream()
         .filter(InitialNode.class::isInstance)
         .map(InitialNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childInitialNodes);

      List<GModelElement> childFinalNodes = umlActivity.getOwnedNodes().stream()
         .filter(FinalNode.class::isInstance)
         .map(FinalNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childFinalNodes);

      List<GModelElement> childFlowFinalNodes = umlActivity.getOwnedNodes().stream()
         .filter(FlowFinalNode.class::isInstance)
         .map(FlowFinalNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childFlowFinalNodes);

      List<GModelElement> childDecisionMergeNodes = umlActivity.getOwnedNodes().stream()
         .filter(DecisionNode.class::isInstance)
         .map(DecisionNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childDecisionMergeNodes);

      List<GModelElement> childForkNodes = umlActivity.getOwnedNodes().stream()
         .filter(ForkNode.class::isInstance)
         .map(ForkNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childForkNodes);

      System.out.println("ACTIVITY CHILDREN " + structureCompartment.getChildren());

      activityNode.getChildren().add(structureCompartment);
      return activityNode;
   }

   protected void applyShapeData(final Classifier classifier, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(classifier, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
         if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

   protected GCompartment buildActivityHeader(final Activity umlActivity) {
      GCompartmentBuilder classHeaderBuilder = new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
         .layout(GConstants.Layout.HBOX)
         .id(UmlIDUtil.createHeaderId(toId(umlActivity)));

      GCompartment classHeaderIcon = new GCompartmentBuilder(getType(umlActivity))
         .id(UmlIDUtil.createHeaderIconId(toId(umlActivity))).build();
      classHeaderBuilder.add(classHeaderIcon);

      GLabel classHeaderLabel = new GLabelBuilder(Types.LABEL_NAME)
         .id(UmlIDUtil.createHeaderLabelId(toId(umlActivity)))
         .text(umlActivity.getName()).build();
      classHeaderBuilder.add(classHeaderLabel);

      return classHeaderBuilder.build();
   }

   protected GCompartment createActivityChildrenCompartment(final Collection<? extends EObject> children,
      final Activity activity) {
      return new GCompartmentBuilder(Types.COMP) //
         .id(toId(activity) + "_childCompartment")
         .layout(GConstants.Layout.VBOX) //
         .layoutOptions(new GLayoutOptions() //
            .hAlign(GConstants.HAlign.LEFT) //
            .resizeContainer(true)) //
         .addAll(children.stream() //
            .map(parentFactory::create)
            .collect(Collectors.toList()))
         .addAll(activity.getOwnedComments().stream()
            .flatMap(c -> parentFactory.commentFactory.create(c).stream())
            .collect(Collectors.toList()))
         .build();
   }

   protected GCompartment createConditionCompartment(final Activity activity) {
      return new GCompartmentBuilder(Types.COMP) //
         .id(toId(activity) + "_conditionCompartment")
         .layout(GConstants.Layout.VBOX)
         .addCssClass(ActivityCSS.ACTIVITY_CONDITION)
         .layoutOptions(new GLayoutOptions() //
            .hAlign(GConstants.HAlign.LEFT) //
            .resizeContainer(true)) //
         .addAll(activity.getOwnedRules().stream() //
            .map(this::createConditionNode)
            .collect(Collectors.toList()))
         .build();
   }

   private GLabel createConditionNode(final Constraint constraint) {
      GLabel label = new GLabelBuilder(Types.LABEL_NAME)
         .id(UmlIDUtil.createHeaderLabelId(toId(constraint)))
         .text(((OpaqueExpression) constraint.getSpecification()).getBodies().get(0)).build();

      return label;
   }

   private GCompartment createStructureCompartment(final NamedElement namedElement) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.LEFT);
      layoutOptions.put(H_GRAB, true);
      layoutOptions.put(V_GRAB, true);
      GCompartment structCompartment = new GCompartmentBuilder(ActivityTypes.STRUCTURE)
         .id(toId(namedElement) + "_struct")
         .layout(GConstants.Layout.FREEFORM)
         .layoutOptions(layoutOptions)
         .addCssClass("struct")
         .build();
      return structCompartment;
   }

   protected static String getType(final Classifier classifier) {
      if (classifier instanceof Activity) {
         return ActivityTypes.ICON_ACTIVITY;
      }
      return "Classifier not found";
   }
   */
}
