package com.eclipsesource.uml.glsp.old.diagram.deployment_diagram.operations;

public class CreateDeploymentDiagramChildNodeOperationHandler { /*-


   public CreateDeploymentDiagramChildNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(
      DeploymentTypes.DEPLOYMENT_COMPONENT);

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateNodeOperation) {
         CreateNodeOperation action = (CreateNodeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final CreateNodeOperation operation, final DeploymentModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();
      String containerId = operation.getContainerId();
      NamedElement container = getOrThrow(modelState.getIndex().getEObject(containerId), NamedElement.class,
         "No valid container with id " + containerId + " found");
      System.out.println("CONTAINER " + container.getLabel());
      String elementTypeId = operation.getElementTypeId();
      // GPoint location = getPosition(modelState, container, operation.getLocation().orElse(GraphUtil.point(0, 0)));
      GPoint location = getPosition(modelState, container, GraphUtil.point(0, 0));

      if (DeploymentTypes.DEPLOYMENT_COMPONENT.equals(elementTypeId)) {
         modelAccess.addDeploymentComponent(modelState, location, container)
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute create operation on new Component node");
               }
            });
      }

   }

   private GPoint getPosition(final UmlModelState modelState, final Element container, final GPoint position) {
      Shape containerShape = modelState.getIndex().getNotation(container, Shape.class).get();
      double x = position.getX();
      double y = position.getY();
      x = Math.max(0, x - containerShape.getPosition().getX());
      y = Math.max(0, y - containerShape.getPosition().getY() - 43);

      if (container instanceof Device) {
         return GraphUtil.point(x, y);
      }
      return GraphUtil.point(0, 0);
   }

   @Override
   public String getLabel() { return "Create deployment child node"; }
   */
}
