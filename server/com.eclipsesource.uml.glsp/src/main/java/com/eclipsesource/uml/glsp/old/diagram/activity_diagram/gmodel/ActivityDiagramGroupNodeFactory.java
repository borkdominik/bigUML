/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.old.diagram.activity_diagram.gmodel;

public class ActivityDiagramGroupNodeFactory { /*-

   private final ActivityDiagramFactory parentFactory;
   private final ActivityDiagramChildNodeFactory activityDiagramChildNodeFactory;

   private static final String V_GRAB = "vGrab";
   private static final String H_GRAB = "hGrab";
   private static final String H_ALIGN = "hAlign";

   public ActivityDiagramGroupNodeFactory(final UmlModelState modelState, final ActivityDiagramFactory parentFactory,
      final ActivityDiagramChildNodeFactory activityDiagramChildNodeFactory) {
      super(modelState);
      this.parentFactory = parentFactory;
      this.activityDiagramChildNodeFactory = activityDiagramChildNodeFactory;
   }

   @Override
   public GNode create(final ActivityGroup activityGroup) {
      if (activityGroup instanceof ActivityPartition) {
         return createPartition((ActivityPartition) activityGroup);
      } else if (activityGroup instanceof InterruptibleActivityRegion) {
         return create((InterruptibleActivityRegion) activityGroup);
      }
      return null;
   }

   protected GNode createPartition(final ActivityPartition partition) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.CENTER);
      layoutOptions.put(H_GRAB, false);
      layoutOptions.put(V_GRAB, false);

      GNodeBuilder b = new GNodeBuilder(ActivityTypes.PARTITION) //
         .id(toId(partition)) //
         .layout(GConstants.Layout.VBOX) //
         .layoutOptions(layoutOptions)
         .addCssClass(CSS.NODE) //
         .addCssClass(CSS.PACKAGEABLE_NODE) //
         .add(buildHeader(partition));

      applyShapeData(partition, b);

      GNode partitionNode = b.build();

      GCompartment structureCompartment = createStructureCompartment(partition);

      List<GModelElement> childPartitions = partition.getSubpartitions().stream()
         .filter(Objects::nonNull)
         .map(ActivityPartition.class::cast)
         .map(this::createPartition)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childPartitions);

      System.out.println("CHILD PARTITIONS " + structureCompartment.getChildren());

      List<GModelElement> childActions = partition.getNodes().stream()
         .filter(OpaqueAction.class::isInstance)
         .map(OpaqueAction.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childActions);

      List<GModelElement> childCallActions = partition.getNodes().stream()
         .filter(CallBehaviorAction.class::isInstance)
         .map(CallBehaviorAction.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childCallActions);

      List<GModelElement> childInitialNodes = partition.getNodes().stream()
         .filter(InitialNode.class::isInstance)
         .map(InitialNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childInitialNodes);

      List<GModelElement> childFinalNodes = partition.getNodes().stream()
         .filter(FinalNode.class::isInstance)
         .map(FinalNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childFinalNodes);

      List<GModelElement> childFlowFinalNodes = partition.getNodes().stream()
         .filter(FlowFinalNode.class::isInstance)
         .map(FlowFinalNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childFlowFinalNodes);

      List<GModelElement> childDecisionMergeNodes = partition.getNodes().stream()
         .filter(DecisionNode.class::isInstance)
         .map(DecisionNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childDecisionMergeNodes);

      List<GModelElement> childForkNodes = partition.getNodes().stream()
         .filter(ForkNode.class::isInstance)
         .map(ForkNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childForkNodes);

      List<GModelElement> childEvents = partition.getNodes().stream()
         .filter(AcceptEventAction.class::isInstance)
         .map(AcceptEventAction.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childEvents);

      List<GModelElement> childSendSignalActions = partition.getNodes().stream()
         .filter(SendSignalAction.class::isInstance)
         .map(SendSignalAction.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childSendSignalActions);

      System.out.println("PARTITION CHILDREN " + structureCompartment.getChildren());

      partitionNode.getChildren().add(structureCompartment);
      return partitionNode;
   }

   protected GNode create(final InterruptibleActivityRegion region) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.CENTER);
      layoutOptions.put(H_GRAB, false);
      layoutOptions.put(V_GRAB, false);

      GNodeBuilder b = new GNodeBuilder(ActivityTypes.INTERRUPTIBLEREGION) //
         .id(toId(region)) //
         .layout(GConstants.Layout.VBOX) //
         .layoutOptions(layoutOptions)
         .addCssClass(CSS.NODE) //
         .addCssClass(CSS.PACKAGEABLE_NODE); //
      // .add(buildHeader(region));

      applyShapeData(region, b);

      GNode regionNode = b.build();

      GCompartment structureCompartment = createStructureCompartment(region);

      List<GModelElement> childEvents = region.getNodes().stream()
         .filter(AcceptEventAction.class::isInstance)
         .map(AcceptEventAction.class::cast)
         .map(activityDiagramChildNodeFactory::createAction)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childEvents);

      List<GModelElement> childFinalNodes = region.getNodes().stream()
         .filter(FinalNode.class::isInstance)
         .map(FinalNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childFinalNodes);

      List<GModelElement> childFlowFinalNodes = region.getNodes().stream()
         .filter(FlowFinalNode.class::isInstance)
         .map(FlowFinalNode.class::cast)
         .map(activityDiagramChildNodeFactory::create)
         .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childFlowFinalNodes);

      regionNode.getChildren().add(structureCompartment);
      return regionNode;

      /*
       * List<EObject> children = new ArrayList<>(region.getOwnedElements());
       * children.addAll(region.getNodes());
       * GNodeBuilder b = new GNodeBuilder(ActivityTypes.INTERRUPTIBLEREGION) //
       * .id(toId(region)) //
       * .layout(GConstants.Layout.VBOX) //
       * .addCssClass(CSS.NODE)
       * .addCssClass(CSS.PACKAGEABLE_NODE) //
       * .add(createLabeledChildrenCompartment(children, region));
       * applyShapeData(region, b);
       * return b.build();
       *
   }

   protected GCompartment buildHeader(final ActivityGroup activityGroup) {
      return new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER) //
         .layout("hbox") //
         .id(toId(activityGroup) + "_header") //
         .add(new GLabelBuilder(CoreTypes.LABEL_NAME) //
            .id(toId(activityGroup) + "_header_label").text(activityGroup.getName()) //
            .build()) //
         .build();
   }

   protected void applyShapeData(final ActivityGroup activityGroup, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(activityGroup, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
         if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

   protected GCompartment createLabeledChildrenCompartment(final Collection<? extends EObject> children,
      final ActivityGroup parent) {
      return new GCompartmentBuilder(CoreTypes.COMP) //
         .id(toId(parent) + "_childCompartment").layout(GConstants.Layout.VBOX) //
         .layoutOptions(new GLayoutOptions() //
            .hAlign(GConstants.HAlign.LEFT) //
            .resizeContainer(true)) //
         .addAll(children.stream() //
            .map(parentFactory::create)
            .collect(Collectors.toList()))
         .build();
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
   */
}
