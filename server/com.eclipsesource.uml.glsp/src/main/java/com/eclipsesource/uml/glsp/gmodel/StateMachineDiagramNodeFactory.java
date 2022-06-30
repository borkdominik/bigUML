package com.eclipsesource.uml.glsp.gmodel;

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
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.StateMachine;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class StateMachineDiagramNodeFactory extends AbstractGModelFactory<Classifier, GNode> {

   private final DiagramFactory parentFactory;

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


   protected GNode createStateMachineNode(final StateMachine umlStateMachine) {
      GNodeBuilder stateMachineNodeBuilder = new GNodeBuilder(Types.STATE_MACHINE)
            .id(toId(umlStateMachine))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE);

      applyShapeData(umlStateMachine, stateMachineNodeBuilder);

      GCompartment stateMachineHeader = buildStateMachineHeader(umlStateMachine);
      stateMachineNodeBuilder.add(stateMachineHeader);

      /*GCompartment stateMachineRegionCompartment = buildStateMachineRegionCompartment(umlStateMachine.getRegions(),
            umlStateMachine);
      stateMachineNodeBuilder.add(stateMachineRegionCompartment);*/

      List<GModelElement> ports = umlStateMachine.getConnectionPoints().stream()
            .map(parentFactory::create)
            .collect(Collectors.toList());
      stateMachineNodeBuilder.addAll(ports);

      return stateMachineNodeBuilder.build();
   }

   protected GNode createRegionNode(final Region umlRegion) {
      GNodeBuilder builder = new GNodeBuilder(Types.STATE_MACHINE)
            .id(toId(umlRegion))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE);
      
      applyShapeData((Classifier) umlRegion, builder);

      return builder.build();
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
