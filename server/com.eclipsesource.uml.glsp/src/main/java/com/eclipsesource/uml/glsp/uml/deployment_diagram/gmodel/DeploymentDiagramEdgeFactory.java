package com.eclipsesource.uml.glsp.uml.deployment_diagram.gmodel;

public class DeploymentDiagramEdgeFactory { /*-

   public DeploymentDiagramEdgeFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GEdge create(final Relationship element) {
      System.out.println("reaches edge factory if else");
      if (element instanceof CommunicationPath) {
         return createCommunicationPath((CommunicationPath) element);
      } else if (element instanceof Deployment) {
         return createDeployment((Deployment) element);
      }
      return null;
   }

   protected GEdge createCommunicationPath(final CommunicationPath communicationPath) {
      EList<Property> memberEnds = communicationPath.getMemberEnds();
      Property source = memberEnds.get(0);
      String sourceId = toId(source);
      Property target = memberEnds.get(1);
      String targetId = toId(target);

      GEdgeBuilder b = new GEdgeBuilder(DeploymentTypes.COMMUNICATION_PATH)
         .id(toId(communicationPath))
         .addCssClass(CSS.EDGE)
         .sourceId(toId(source.getType()))
         .targetId(toId(target.getType()))
         .routerKind(GConstants.RouterKind.MANHATTAN)
         .add(createEdgeNameLabel(source.getName(), sourceId + "_label_name", 0.1d))
         .add(createEdgeNameLabel(target.getName(), targetId + "_label_name", 0.5d));

      createBendPoints(communicationPath, b);
      return b.build();
   }

   protected GEdge createDeployment(final Deployment deployment) {
      NamedElement source = deployment.getClients().get(0);
      NamedElement target = deployment.getDeployedArtifacts().get(0);
      String targetId = toId(target);

      GEdgeBuilder b = new GEdgeBuilder(DeploymentTypes.COMMUNICATION_PATH)
         .id(toId(deployment))
         .addCssClass(CSS.EDGE)
         .addCssClass(CSS.EDGE_DOTTED)
         .addCssClass(CSS.EDGE_DIRECTED_END_TENT)
         .sourceId(toId(source))
         .targetId(toId(target))
         .routerKind(GConstants.RouterKind.MANHATTAN)
         // .add(createEdgeNameLabel(target.getName(), targetId + "_label_name", 0.5d));
         .add(createEdgeNameLabel("<<deploys>>", targetId + "_label_name", 0.5d));

      createBendPoints(deployment, b);
      return b.build();
   }

   protected void createBendPoints(final Relationship relationship, final GEdgeBuilder b) {
      modelState.getIndex().getNotation(relationship, Edge.class).ifPresent(edge -> {
         if (edge.getBendPoints() != null) {
            ArrayList<GPoint> bendPoints = new ArrayList<>();
            edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
            b.addRoutingPoints(bendPoints);
         }
      });
   }

   protected GLabel createEdgeMultiplicityLabel(final String value, final String id, final double position) {
      return createEdgeLabel(value, position, id, DeploymentTypes.LABEL_EDGE_MULTIPLICITY, GConstants.EdgeSide.BOTTOM);
   }

   protected GLabel createEdgeNameLabel(final String name, final String id, final double position) {
      return createEdgeLabel(name, position, id, UmlConfig.Types.LABEL_EDGE_NAME, GConstants.EdgeSide.TOP);
   }

   protected GLabel createEdgeLabel(final String name, final double position, final String id, final String type,
      final String side) {
      return new GLabelBuilder(type) //
         .edgePlacement(new GEdgePlacementBuilder()//
            .side(side)//
            .position(position)//
            .offset(2d) //
            .rotate(false) //
            .build())//
         .id(id) //
         .text(name).build();
   }
   */
}
