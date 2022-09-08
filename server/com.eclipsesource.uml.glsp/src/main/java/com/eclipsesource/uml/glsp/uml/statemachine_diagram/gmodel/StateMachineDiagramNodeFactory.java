package com.eclipsesource.uml.glsp.uml.statemachine_diagram.gmodel;

import com.eclipsesource.uml.glsp.gmodel.AbstractGModelFactory;
import com.eclipsesource.uml.glsp.gmodel.DiagramFactory;
import com.eclipsesource.uml.glsp.gmodel.LabelFactory;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
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

public class StateMachineDiagramNodeFactory extends AbstractGModelFactory<Classifier, GNode> {

   private final DiagramFactory parentFactory;

   private static final String V_GRAB = "vGrab";
   private static final String H_GRAB = "hGrab";
   private static final String H_ALIGN = "hAlign";

   public StateMachineDiagramNodeFactory(final UmlModelState modelState, final LabelFactory labelFactory,
                                         final DiagramFactory parentFactory) {
      super(modelState);
      this.parentFactory = parentFactory;
   }

   @Override
   public GNode create(final Classifier classifier) {
      if (classifier instanceof StateMachine) {
         return createStateMachineNode((StateMachine) classifier);
      } else if (classifier instanceof Region) {
         return createRegionNode((Region) classifier);
      }
      return null;
   }

   protected void applyShapeData(final Classifier classifier, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(classifier, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         } else if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

   protected void applyShapeData(final Region region, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(region, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         } else if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }


   protected GNode createStateMachineNode(final StateMachine umlStateMachine) {

      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.CENTER);
      layoutOptions.put(H_GRAB, false);
      layoutOptions.put(V_GRAB, false);

      GNodeBuilder builder = new GNodeBuilder(Types.STATE_MACHINE)
            .id(toId(umlStateMachine))
            .layout(GConstants.Layout.VBOX)
            .layoutOptions(layoutOptions)
            .add(buildStateMachineHeader(umlStateMachine))
            .addCssClass(CSS.NODE)
            .addCssClass(CSS.PACKAGEABLE_NODE);

      applyShapeData(umlStateMachine, builder);

      GNode stateMachineNode = builder.build();

      GCompartment structureCompartment = createStructureCompartment(umlStateMachine);

      // CHILDREN
      List<GModelElement> childRegions = umlStateMachine.getRegions().stream()
            .filter(Objects::nonNull)
            .map(Region.class::cast)
            .map(this::createRegionNode)
            .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childRegions);

      List<GModelElement> childPseudoStates = umlStateMachine.getRegions().stream()
            .filter(Pseudostate.class::isInstance)
            .map(Pseudostate.class::cast)
            .map(parentFactory::create)
            .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childPseudoStates);

      stateMachineNode.getChildren().add(structureCompartment);

      return stateMachineNode;
   }

   protected GNode createRegionNode(final Region umlRegion) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.CENTER);
      layoutOptions.put(H_GRAB, false);
      layoutOptions.put(V_GRAB, false);

      GNodeBuilder builder = new GNodeBuilder(Types.REGION)
            .id(toId(umlRegion))
            .layout(GConstants.Layout.VBOX)
            .layoutOptions(layoutOptions)
            .addCssClass(CSS.NODE)
            .addCssClass(CSS.PACKAGEABLE_NODE);

      applyShapeData(umlRegion, builder);

      GNode regionNode = builder.build();

      GCompartment structureCompartment = createRegionStructureCompartment(umlRegion);

      // CHILDREN
      List<GModelElement> childStates = umlRegion.getSubvertices().stream()
            .filter(State.class::isInstance)
            .map(State.class::cast)
            .map(parentFactory::create)
            .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childStates);

      List<GModelElement> childPseudoStates = umlRegion.getSubvertices().stream()
            .filter(Pseudostate.class::isInstance)
            .map(Pseudostate.class::cast)
            .map(parentFactory::create)
            .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childPseudoStates);

      List<GModelElement> childFinalStates = umlRegion.getSubvertices().stream()
            .filter(FinalState.class::isInstance)
            .map(FinalState.class::cast)
            .map(parentFactory::create)
            .collect(Collectors.toList());
      structureCompartment.getChildren().addAll(childFinalStates);


      regionNode.getChildren().add(structureCompartment);
      return regionNode;
   }


   private GCompartment createStructureCompartment(final StateMachine umlStateMachine) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.LEFT);
      layoutOptions.put(H_GRAB, true);
      layoutOptions.put(V_GRAB, true);
      GCompartment structCompartment = new GCompartmentBuilder(Types.STRUCTURE)
            .id(toId(umlStateMachine) + "_struct")
            .layout(GConstants.Layout.FREEFORM)
            .layoutOptions(layoutOptions)
            .addCssClass("struct")
            .build();
      return structCompartment;
   }

   private GCompartment createRegionStructureCompartment(final Region umlRegion) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.LEFT);
      layoutOptions.put(H_GRAB, true);
      layoutOptions.put(V_GRAB, true);
      GCompartment structCompartment = new GCompartmentBuilder(Types.STRUCTURE)
            .id(toId(umlRegion) + "_struct")
            .layout(GConstants.Layout.FREEFORM)
            .layoutOptions(layoutOptions)
            .addCssClass("struct")
            .build();
      return structCompartment;
   }


   protected GCompartment buildStateMachineHeader(final StateMachine umlStateMachine) {
      GCompartmentBuilder stateMachineHeaderBuilder = new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout(GConstants.Layout.HBOX)
            .id(UmlIDUtil.createHeaderId(toId(umlStateMachine)));

      GCompartment stateMachineHeaderIcon = new GCompartmentBuilder(Types.ICON_STATE_MACHINE)
            .id(UmlIDUtil.createHeaderIconId(toId(umlStateMachine))).build();
      stateMachineHeaderBuilder.add(stateMachineHeaderIcon);

      GLabel stateMachineHeaderLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(umlStateMachine)))
            .text(umlStateMachine.getName()).build();
      stateMachineHeaderBuilder.add(stateMachineHeaderLabel);

      return stateMachineHeaderBuilder.build();
   }


   protected GCompartment buildStateMachineRegionCompartment(final Collection<Region> children,
                                                             final Classifier parent) {
      GCompartmentBuilder stateMachineRegionsBuilder = new GCompartmentBuilder(Types.COMP)
            .id(UmlIDUtil.createChildCompartmentId(toId(parent))).layout(GConstants.Layout.VBOX);

      GLayoutOptions layoutOptions = new GLayoutOptions()
            .hAlign(GConstants.HAlign.LEFT)
            .resizeContainer(true);
      stateMachineRegionsBuilder.layoutOptions(layoutOptions);

      List<GModelElement> regions = children.stream()
            .map(parentFactory::create)
            .collect(Collectors.toList());
      stateMachineRegionsBuilder.addAll(regions);

      return stateMachineRegionsBuilder.build();
   }

}
