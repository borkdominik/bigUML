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
package com.eclipsesource.uml.glsp.gmodel;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.*;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;

public class ActivityDiagramChildNodeFactory extends AbstractGModelFactory<ActivityNode, GNode> {

   public ActivityDiagramChildNodeFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GNode create(final ActivityNode activityNode) {
      if (activityNode instanceof Action) {
         return create((Action) activityNode);
      } else if (activityNode instanceof ControlNode) {
         return create((ControlNode) activityNode);
      } else if (activityNode instanceof CentralBufferNode) {
         return create((CentralBufferNode) activityNode);
      } else if (activityNode instanceof ActivityParameterNode) {
         return create((ActivityParameterNode) activityNode);
      }
      return null;
   }

   protected GNode create(final Action action) {
      String type = null;
      if (action instanceof OpaqueAction) {
         type = Types.ACTION;
      } else if (action instanceof SendSignalAction) {
         type = Types.SENDSIGNAL;
      } else if (action instanceof CallAction) {
         type = Types.CALL;
      } else if (action instanceof AcceptEventAction) {
         if (((AcceptEventAction) action).getTriggers().stream().anyMatch(t -> "timeEvent".equals(t.getName()))) {
            type = Types.TIMEEVENT;
         } else {
            type = Types.ACCEPTEVENT;
         }
      } else {
         return null;
      }

      GNodeBuilder b = new GNodeBuilder(type) //
         .id(toId(action)) //
         .layout(GConstants.Layout.VBOX) //
         .addCssClass(CSS.NODE) //
         .add(buildHeader(action));

      // TODO!!!
      /*if (action instanceof OpaqueAction) {
         // b.add(buildPins(action, ((OpaqueAction) action).getInputValues(), "input"));
         // b.add(buildPins(action, ((OpaqueAction) action).getOutputValues(), "output"));

         b.addAll(
            ((OpaqueAction) action).getInputValues().stream().map(this::create).collect(Collectors.toList()));
         b.addAll(
            ((OpaqueAction) action).getOutputValues().stream().map(this::create).collect(Collectors.toList()));
      }*/
      /*if (action instanceof InvocationAction) {
         // b.add(buildPins(action, ((InvocationAction) action).getArguments(), "input"));
      }
      if (action instanceof CallAction) {
         // b.add(buildPins(action, ((CallAction) action).getResults(), "output"));
      }
      if (action instanceof AcceptEventAction) {
         // b.add(buildPins(action, ((AcceptEventAction) action).getResults(), "output"));
      }*/

      applyShapeData(action, b);
      return b.build();
   }

   protected GNode create(final ControlNode node) {
      String type = null;
      if (node instanceof InitialNode) {
         type = Types.INITIALNODE;
      } else if (node instanceof ActivityFinalNode) {
         type = Types.FINALNODE;
      } else if (node instanceof FlowFinalNode) {
         type = Types.FLOWFINALNODE;
      } else if (node instanceof DecisionNode || node instanceof MergeNode) {
         type = Types.DECISIONMERGENODE;
      } else if (node instanceof ForkNode || node instanceof JoinNode) {
         type = Types.FORKJOINNODE;
      } else {
         return null;
      }
      GNodeBuilder b = new GNodeBuilder(type) //
         .id(toId(node)) //
         .layout(GConstants.Layout.VBOX) //
         .addCssClass(CSS.NODE);

      applyShapeData(node, b);
      return b.build();
   }

   protected GNode create(final ActivityParameterNode node) {
      GNodeBuilder b = new GNodeBuilder(Types.PARAMETER) //
         .id(toId(node)) //
         .layout(GConstants.Layout.VBOX) //
         .addCssClass(CSS.NODE)
         .add(new GCompartmentBuilder(Types.COMP_HEADER) //
            .layout(GConstants.Layout.VBOX) //
            .id(toId(node) + "_header")
            .add(new GLabelBuilder(Types.LABEL_NAME) //
               .id(UmlIDUtil.createHeaderLabelId(toId(node)))
               .text(node.getName()) //
               .build()) //
            .build());

      applyShapeData(node, b);
      return b.build();
   }

   protected GNode create(final CentralBufferNode node) {
      String type = null;
      String header = null;
      if (node instanceof DataStoreNode) {
         type = Types.DATASTORE;
         header = "<<datastore>>";
      } else if (node != null) {
         type = Types.CENTRALBUFFER;
         header = "<<centralBuffer>>";
      } else {
         return null;
      }
      GNodeBuilder b = new GNodeBuilder(type) //
         .id(toId(node)) //
         .layout(GConstants.Layout.VBOX) //
         .addCssClass(CSS.NODE)
         .add(new GCompartmentBuilder(Types.COMP_HEADER) //
            .layout(GConstants.Layout.VBOX) //
            .id(UmlIDUtil.createHeaderId(toId(node)))
            .add(new GLabelBuilder(Types.LABEL_TEXT) //
               .id(toId(node) + "_header_labeltype").text(header) //
               .build()) //
            .add(new GLabelBuilder(Types.LABEL_NAME) //
               .id(UmlIDUtil.createHeaderLabelId(toId(node)))
               .text(node.getName())
               .build()) //
            .build());

      applyShapeData(node, b);
      return b.build();
   }

   protected GNode create(final Pin pin) {
      GNodeBuilder b = new GNodeBuilder(Types.PIN) //
         .id(toId(pin)) //
         .layout(GConstants.Layout.VBOX) //
         .addCssClass(CSS.NODE)
         .add(buildHeader(pin))
         .add(new GNodeBuilder(Types.PIN_PORT).id(toId(pin) + "_port").size(10, 10).build());

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
      String labelType = Types.LABEL_NAME;
      if (action instanceof CallBehaviorAction) {
         CallBehaviorAction cba = (CallBehaviorAction) action;
         text = cba.getBehavior() != null ? cba.getBehavior().getName() : "<NoRef>";
         labelType = Types.CALL_REF;
      }
      return new GCompartmentBuilder(Types.COMP_HEADER) //
         .layout("hbox") //
         .id(UmlIDUtil.createHeaderId(toId(action)))
         .add(new GLabelBuilder(labelType) //
            .id(UmlIDUtil.createHeaderLabelId(toId(action))).text(text) //
            .build()) //
         .build();
   }

   protected GCompartment buildHeader(final ObjectNode node) {
      return new GCompartmentBuilder(Types.COMP_HEADER) //
         .layout("hbox") //
         .id(UmlIDUtil.createHeaderId(toId(node)))
         .add(new GLabelBuilder(Types.LABEL_NAME) //
            .id(UmlIDUtil.createHeaderLabelId(toId(node))).text(node.getName()) //
            .build()) //
         .build();
   }

   protected GCompartment buildPins(final Action action, final List<? extends Pin> pins, final String type) {

      return new GCompartmentBuilder(Types.COMP) //
         .id(toId(action) + "_childCompartment" + type).layout(GConstants.Layout.VBOX) //
         .layoutOptions(new GLayoutOptions() //
            .hAlign(GConstants.HAlign.LEFT) //
            .resizeContainer(true)) //
         .addAll(pins.stream() //
            .map(pin -> create(pin))
            .collect(Collectors.toList()))
         .build();
   }

}
