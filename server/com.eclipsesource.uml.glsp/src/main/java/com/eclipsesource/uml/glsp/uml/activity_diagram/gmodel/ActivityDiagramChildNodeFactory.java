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
package com.eclipsesource.uml.glsp.uml.activity_diagram.gmodel;

public class ActivityDiagramChildNodeFactory { /*-

   public ActivityDiagramChildNodeFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GNode create(final ActivityNode activityNode) {
      if (activityNode instanceof Action) {
         return createAction((Action) activityNode);
      } else if (activityNode instanceof ControlNode) {
         return createControlNode((ControlNode) activityNode);
      } else if (activityNode instanceof CentralBufferNode) {
         return createCentralBuffer((CentralBufferNode) activityNode);
      } else if (activityNode instanceof ActivityParameterNode) {
         return createParameter((ActivityParameterNode) activityNode);
      } else if (activityNode instanceof Pin) {
         return createPin((Pin) activityNode);
      }
      return null;
   }

   protected GNode createAction(final Action action) {
      String type;
      if (action instanceof OpaqueAction) {
         type = ActivityTypes.ACTION;
      } else if (action instanceof SendSignalAction) {
         type = ActivityTypes.SENDSIGNAL;
      } else if (action instanceof CallBehaviorAction) {
         System.out.println("CALL");
         type = ActivityTypes.CALL;
      } else if (action instanceof AcceptEventAction) {
         System.out.println("EVENT");
         if (((AcceptEventAction) action).getTriggers().stream().anyMatch(t -> "timeEvent".equals(t.getName()))) {
            type = ActivityTypes.TIMEEVENT;
         } else {
            type = ActivityTypes.ACCEPTEVENT;
         }
      } else {
         return null;
      }
      GNodeBuilder b = new GNodeBuilder(type) //
         .id(toId(action)) //
         .layout(GConstants.Layout.VBOX) //
         .addCssClass(CSS.NODE) //
         .add(buildHeader(action));

      if (action instanceof OpaqueAction) {
         b.add(buildPins(action, ((OpaqueAction) action).getInputValues(), "input"));
         b.add(buildPins(action, ((OpaqueAction) action).getOutputValues(), "output"));

         b.addAll(
            ((OpaqueAction) action).getInputValues().stream().map(this::createPin).collect(Collectors.toList()));
         b.addAll(
            ((OpaqueAction) action).getOutputValues().stream().map(this::createPin).collect(Collectors.toList()));
      }

      applyShapeData(action, b);
      return b.build();
   }

   protected GNode createCall(final CallAction callAction) {
      System.out.println("goes into call action factory");
      GNodeBuilder b = new GNodeBuilder(ActivityTypes.CALL) //
         .id(toId(callAction)) //
         .layout(GConstants.Layout.VBOX) //
         .addCssClass(CSS.NODE) //
         .add(buildHeader(callAction));

      applyShapeData(callAction, b);
      return b.build();
   }

   protected GNode createControlNode(final ControlNode node) {
      String type;
      if (node instanceof InitialNode) {
         type = ActivityTypes.INITIALNODE;
      } else if (node instanceof ActivityFinalNode) {
         type = ActivityTypes.FINALNODE;
      } else if (node instanceof FlowFinalNode) {
         type = ActivityTypes.FLOWFINALNODE;
      } else if (node instanceof DecisionNode || node instanceof MergeNode) {
         type = ActivityTypes.DECISIONMERGENODE;
      } else if (node instanceof ForkNode || node instanceof JoinNode) {
         type = ActivityTypes.FORKJOINNODE;
      } else {
         return null;
      }
      Random rand = new Random();
      GNodeBuilder b = new GNodeBuilder(type) //
         .id(toId(node) + rand.nextInt(1000)) //
         .layout(GConstants.Layout.VBOX) //
         .addCssClass(CSS.NODE);

      applyShapeData(node, b);
      return b.build();
   }

   protected GNode createParameter(final ActivityParameterNode node) {
      GNodeBuilder b = new GNodeBuilder(ActivityTypes.PARAMETER) //
         .id(toId(node)) //
         .layout(GConstants.Layout.VBOX) //
         .addCssClass(CSS.NODE)
         .add(new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER) //
            .layout(GConstants.Layout.VBOX) //
            .id(toId(node) + "_header")
            .add(new GLabelBuilder(UmlConfig.Types.LABEL_NAME) //
               .id(UmlIDUtil.createHeaderLabelId(toId(node)))
               .text(node.getName()) //
               .build()) //
            .build());

      applyShapeData(node, b);
      return b.build();
   }

   protected GNode createCentralBuffer(final CentralBufferNode node) {
      String type, header;
      if (node instanceof DataStoreNode) {
         type = ActivityTypes.DATASTORE;
         header = "<<datastore>>";
      } else if (node != null) {
         type = ActivityTypes.CENTRALBUFFER;
         header = "<<centralBuffer>>";
      } else {
         return null;
      }
      Random rand = new Random();
      GNodeBuilder b = new GNodeBuilder(type) //
         .id(toId(node) + rand.nextInt(1000)) //
         .layout(GConstants.Layout.VBOX) //
         .addCssClass(CSS.NODE)
         .add(new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER) //
            .layout(GConstants.Layout.VBOX) //
            .id(UmlIDUtil.createHeaderId(toId(node)))
            .add(new GLabelBuilder(UmlConfig.Types.LABEL_TEXT) //
               .id(toId(node) + "_header_labeltype").text(header) //
               .build()) //
            .add(new GLabelBuilder(UmlConfig.Types.LABEL_NAME) //
               .id(UmlIDUtil.createHeaderLabelId(toId(node)))
               .text(node.getName())
               .build()) //
            .build());

      applyShapeData(node, b);
      return b.build();
   }

   protected GNode createPin(final Pin pin) {
      System.out.println("GOES INTO Pin CREATE");
      GNodeBuilder b = new GNodeBuilder(ActivityTypes.PIN) //
         .id(toId(pin)) //
         .layout(GConstants.Layout.VBOX) //
         .addCssClass(CSS.NODE)
         .add(buildHeader(pin))
         .add(new GNodeBuilder(ActivityTypes.PIN_PORT).id(toId(pin) + "_port").size(10, 10).build());

      applyShapeData(pin, b);
      return b.build();
   }

   protected void applyShapeData(final ActivityNode activityNode, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(activityNode, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
         if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

   protected void applyShapeData(final Activity activityNode, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(activityNode, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
         if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

   protected GCompartment buildHeader(final Action action) {
      String text = action.getName();
      String labelType = UmlConfig.Types.LABEL_NAME;
      if (action instanceof CallBehaviorAction) {
         CallBehaviorAction cba = (CallBehaviorAction) action;
         text = cba.getBehavior() != null ? cba.getBehavior().getName() : "<NoRef>";
         labelType = ActivityTypes.CALL_REF;
      }
      Random rand = new Random();
      return new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER) //
         .layout("hbox") //
         .id(UmlIDUtil.createHeaderId(toId(action) + rand.nextInt(1000)))
         .add(new GLabelBuilder(labelType) //
            .id(UmlIDUtil.createHeaderLabelId(toId(action) + rand.nextInt(1000))).text(text) //
            .build()) //
         .build();
   }

   protected GCompartment buildHeader(final ObjectNode node) {
      return new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER) //
         .layout("hbox") //
         .id(UmlIDUtil.createHeaderId(toId(node)))
         .add(new GLabelBuilder(UmlConfig.Types.LABEL_NAME) //
            .id(UmlIDUtil.createHeaderLabelId(toId(node))).text(node.getName()) //
            .build()) //
         .build();
   }

   protected GCompartment buildPins(final Action action, final List<? extends Pin> pins, final String type) {

      return new GCompartmentBuilder(UmlConfig.Types.COMP) //
         .id(toId(action) + "_childCompartment" + type).layout(GConstants.Layout.VBOX) //
         .layoutOptions(new GLayoutOptions() //
            .hAlign(GConstants.HAlign.LEFT) //
            .resizeContainer(true)) //
         .addAll(pins.stream() //
            .map(this::createPin)
            .collect(Collectors.toList()))
         .build();
   }
   */
}
