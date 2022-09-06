package com.eclipsesource.uml.glsp.uml.statemachine_diagram.gmodel;

import com.eclipsesource.uml.glsp.gmodel.AbstractGModelFactory;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.*;

import java.util.*;
import java.util.stream.Collectors;

public class StateMachineDiagramVertexFactory extends AbstractGModelFactory<Vertex, GNode> {

   private final StateMachineDiagramNodeFactory stateMachineDiagramNodeFactory;

   private static final String V_GRAB = "vGrab";
   private static final String H_GRAB = "hGrab";
   private static final String H_ALIGN = "hAlign";


   public StateMachineDiagramVertexFactory(final UmlModelState modelState,
                                           final StateMachineDiagramNodeFactory stateMachineDiagramNodeFactory) {
      super(modelState);
      this.stateMachineDiagramNodeFactory = stateMachineDiagramNodeFactory;
   }

   @Override
   public GNode create(final Vertex vertex) {
      if (vertex instanceof State) {
         return create((State) vertex);
      } else if (vertex instanceof Pseudostate) {
         return create((Pseudostate) vertex);
      }
      return null;
   }

   protected GNode create(final State umlState) {
      if (umlState instanceof FinalState) {
         return createFinalState((FinalState) umlState);
      }
      return createState(umlState);
   }

   protected GNode create(final Pseudostate umlPseudostate) {
      switch (umlPseudostate.getKind().getValue()) {
         case PseudostateKind.INITIAL:
            return createInitialState(umlPseudostate);
         case PseudostateKind.DEEP_HISTORY:
            return createDeepHistory(umlPseudostate);
         case PseudostateKind.SHALLOW_HISTORY:
            return createShallowHistory(umlPseudostate);
         case PseudostateKind.FORK:
            return createFork(umlPseudostate);
         case PseudostateKind.JOIN:
            return createJoin(umlPseudostate);
         case PseudostateKind.JUNCTION:
            return createJunction(umlPseudostate);
         case PseudostateKind.CHOICE:
            return createChoice(umlPseudostate);
         case PseudostateKind.TERMINATE:
            return createTerminate(umlPseudostate);
         case PseudostateKind.ENTRY_POINT:
            return createEntryPoint(umlPseudostate);
         case PseudostateKind.EXIT_POINT:
            return createExitPoint(umlPseudostate);
      }
      return null;
   }

   protected GNode createFinalState(final FinalState umlFinalState) {
      Random rand = new Random();
      GNodeBuilder b = new GNodeBuilder(Types.FINAL_STATE)
            .id(toId(umlFinalState) + rand.nextInt(1000))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE)
            .size(30, 30);

      applyShapeData(umlFinalState, b);
      return b.build();
   }

   protected GNode createState(final State umlState) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.CENTER);
      layoutOptions.put(H_GRAB, false);
      layoutOptions.put(V_GRAB, false);

      GNodeBuilder b = new GNodeBuilder(Types.STATE)
            .id(toId(umlState))
            .layout(GConstants.Layout.VBOX)
            .layoutOptions(layoutOptions)
            .addCssClass(CSS.NODE)
            .addCssClass(CSS.PACKAGEABLE_NODE)
            .add(buildHeader(umlState))
            .add(createLabeledStateChildrenCompartment(umlState));

      applyShapeData(umlState, b);

      GNode stateNode = b.build();

      GCompartment structureCompartment = createStructureCompartment(umlState);

      // CHILDREN
      List<GModelElement> childRegions = umlState.getRegions().stream()
            .filter(Objects::nonNull)
            .map(Region.class::cast)
            .map(stateMachineDiagramNodeFactory::createRegionNode)
            .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childRegions);

      stateNode.getChildren().add(structureCompartment);

      return stateNode;

   }

   protected GNode createInitialState(final Pseudostate umlInitialState) {
      GNodeBuilder b = new GNodeBuilder(Types.INITIAL_STATE)
            .id(toId(umlInitialState))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE)
            .size(30, 30);

      applyShapeData(umlInitialState, b);
      return b.build();
   }

   protected GNode createDeepHistory(final Pseudostate deepHistory) {
      GNodeBuilder b = new GNodeBuilder(Types.DEEP_HISTORY)
            .id(toId(deepHistory))
            .layout(GConstants.Layout.VBOX)
            .size(30, 30)
            .addCssClass(CSS.NODE);

      applyShapeData(deepHistory, b);
      return b.build();
   }

   protected GNode createShallowHistory(final Pseudostate shallowHistory) {
      GNodeBuilder b = new GNodeBuilder(Types.SHALLOW_HISTORY)
            .id(toId(shallowHistory))
            .layout(GConstants.Layout.VBOX)
            .size(30, 30)
            .addCssClass(CSS.NODE);

      applyShapeData(shallowHistory, b);
      return b.build();
   }

   protected GNode createFork(final Pseudostate fork) {
      GNodeBuilder b = new GNodeBuilder(Types.FORK)
            .id(toId(fork))
            .layout(GConstants.Layout.VBOX)
            .size(5, 100)
            .addCssClass(CSS.NODE);

      applyShapeData(fork, b);
      return b.build();
   }

   protected GNode createJoin(final Pseudostate join) {
      GNodeBuilder b = new GNodeBuilder(Types.JOIN)
            .id(toId(join))
            .layout(GConstants.Layout.VBOX)
            .size(5, 100)
            .addCssClass(CSS.NODE);

      applyShapeData(join, b);
      return b.build();
   }

   protected GNode createJunction(final Pseudostate junction) {
      GNodeBuilder b = new GNodeBuilder(Types.JUNCTION)
            .id(toId(junction))
            .layout(GConstants.Layout.VBOX)
            .size(50, 50)
            .addCssClass(CSS.NODE);

      applyShapeData(junction, b);
      return b.build();
   }

   protected GNode createChoice(final Pseudostate choice) {
      GNodeBuilder b = new GNodeBuilder(Types.CHOICE)
            .id(toId(choice))
            .layout(GConstants.Layout.VBOX)
            .size(50, 50)
            .addCssClass(CSS.NODE);

      applyShapeData(choice, b);
      return b.build();
   }

   protected GNode createTerminate(final Pseudostate terminate) {
      GNodeBuilder b = new GNodeBuilder(Types.TERMINATE)
            .id(toId(terminate))
            .layout(GConstants.Layout.VBOX)
            .size(30, 30)
            .addCssClass(CSS.NODE);

      applyShapeData(terminate, b);
      return b.build();
   }

   protected GNode createEntryPoint(final Pseudostate entry) {
      System.out.println("REACHES ENTRY");
      GNodeBuilder b = new GNodeBuilder(Types.ENTRY_POINT)
            .id(toId(entry))
            .layout(GConstants.Layout.VBOX)
            .size(30, 30)
            .addCssClass(CSS.NODE);

      applyShapeData(entry, b);
      return b.build();
   }

   protected GNode createExitPoint(final Pseudostate exit) {
      System.out.println("REACHES EXIT");
      GNodeBuilder b = new GNodeBuilder(Types.EXIT_POINT)
            .id(toId(exit))
            .layout(GConstants.Layout.VBOX)
            .size(30, 30)
            .addCssClass(CSS.NODE);

      applyShapeData(exit, b);
      return b.build();
   }

   protected void applyShapeData(final Vertex vertex, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(vertex, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         } else if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

   protected GCompartment buildHeader(final Vertex vertex) {
      return new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout("hbox")
            .id(toId(vertex) + "_header")
            .add(new GCompartmentBuilder(getType(vertex))
                  .id(toId(vertex) + "_header_icon").build())
            .add(new GLabelBuilder(Types.LABEL_VERTEX_NAME)
                  .id(toId(vertex) + "_header_label").text(vertex.getName())
                  .build())
            .build();
   }

   protected GCompartment buildHeader(final Pseudostate vertex) {
      return new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout("hbox")
            .id(toId(vertex) + "_header")
            .add(new GLabelBuilder(Types.LABEL_VERTEX_NAME)
                  .id(toId(vertex) + "_header_label").text(vertex.getName())
                  .build())
            .build();
   }

   protected GCompartment buildHeader(final State vertex) {
      return new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout("hbox")
            .id(toId(vertex) + "_header")
            .add(new GLabelBuilder(Types.LABEL_VERTEX_NAME)
                  .id(toId(vertex) + "_header_label").text(vertex.getName())
                  .build())
            .build();
   }

   protected GCompartment createLabeledStateChildrenCompartment(final State parent) {
      GCompartmentBuilder builder = new GCompartmentBuilder(Types.COMP)
            .id(toId(parent) + "_childCompartment").layout(GConstants.Layout.VBOX)
            .layoutOptions(new GLayoutOptions()
                  .hAlign(GConstants.HAlign.LEFT)
                  .resizeContainer(true));

      if (parent.getEntry() != null) {
         builder.add(createBehaviorLabel(parent.getEntry(), Types.STATE_ENTRY_ACTIVITY));
      }

      if (parent.getDoActivity() != null) {
         builder.add(createBehaviorLabel(parent.getDoActivity(), Types.STATE_DO_ACTIVITY));
      }

      if (parent.getExit() != null) {
         builder.add(createBehaviorLabel(parent.getExit(), Types.STATE_EXIT_ACTIVITY));
      }

      return builder.build();
   }

   private GLabel createBehaviorLabel(final Behavior behavior, final String activityType) {
      String label = behavior.getName();

      return new GLabelBuilder(activityType)
            .id(toId(behavior))
            .text(label)
            .build();
   }

   protected static String getType(final Vertex vertex) {
      if (vertex instanceof State) {
         return Types.ICON_STATE;
      }

      return "Vertex not found";
   }

   private GCompartment createStructureCompartment(final State umlState) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.LEFT);
      layoutOptions.put(H_GRAB, true);
      layoutOptions.put(V_GRAB, true);
      GCompartment structCompartment = new GCompartmentBuilder(Types.STRUCTURE)
            .id(toId(umlState) + "_struct")
            .layout(GConstants.Layout.FREEFORM)
            .layoutOptions(layoutOptions)
            .addCssClass("struct")
            .build();
      return structCompartment;
   }


}
