package com.eclipsesource.uml.glsp.uml.deployment_diagram.gmodel;

public class DeploymentDiagramChildNodeFactory { /*-

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
   */
}
