package com.eclipsesource.uml.glsp.uml.object_diagram.gmodel;

public class ObjectDiagramEdgeFactory { /*-

   public ObjectDiagramEdgeFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GEdge create(final Relationship element) {
      if (element instanceof Association) {
         return createLinkEdge((Association) element);
      }
      return null;
   }

   protected GEdge createLinkEdge(final Association link) {

      EList<Property> memberEnds = link.getMemberEnds();
      Property source = memberEnds.get(0);
      Property target = memberEnds.get(1);

      GEdgeBuilder builder = new GEdgeBuilder(ObjectTypes.LINK)
         .id(toId(link))
         .addCssClass(CSS.EDGE)
         .sourceId(toId(source.getType()))
         .targetId(toId(target.getType()))
         .routerKind(GConstants.RouterKind.MANHATTAN);

      modelState.getIndex().getNotation(link, Edge.class).ifPresent(edge -> {
         if (edge.getBendPoints() != null) {
            ArrayList<GPoint> bendPoints = new ArrayList<>();
            edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
            builder.addRoutingPoints(bendPoints);
         }
      });
      return builder.build();
   }
   */
}
