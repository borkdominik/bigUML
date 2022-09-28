package com.eclipsesource.uml.glsp.uml.deployment_diagram.gmodel;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.deployment_diagram.constants.DeploymentTypes;
import com.eclipsesource.uml.glsp.utils.UmlConfig;
import com.eclipsesource.uml.glsp.utils.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.utils.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;

public class DeploymentDiagramChildNodeFactory extends DeploymentAbstractGModelFactory<Classifier, GNode> {

   public DeploymentDiagramChildNodeFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GNode create(final Classifier semanticElement) {
      if (semanticElement instanceof Node) {
         return create((Component) semanticElement);
      }
      return null;
   }

   protected GNode create(final Component component) {
      GNodeBuilder builder = new GNodeBuilder(DeploymentTypes.DEPLOYMENT_COMPONENT)
         .id(toId(component))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CSS.NODE)
         .add(buildComponentHeader(component));

      applyShapeData(component, builder);
      return builder.build();
   }

   protected void applyShapeData(final Component component, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(component, Shape.class)
         .ifPresent(shape -> {
            if (shape.getPosition() != null) {
               builder.position(GraphUtil.copy(shape.getPosition()));
            }
            if (shape.getSize() != null) {
               builder.size(GraphUtil.copy(shape.getSize()));
            }
         });
   }

   protected GCompartment buildComponentHeader(final Component component) {
      return new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER)
         .layout("hbox")
         .id(UmlIDUtil.createHeaderId(toId(component)))
         .add(new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(component))).text(component.getName())
            .build())
         .build();
   }
}
