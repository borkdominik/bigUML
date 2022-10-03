package com.eclipsesource.uml.glsp.uml.statemachine_diagram.operations;

public class CreateStateMachineDiagramNodeOperationHandler { /*-

   public CreateStateMachineDiagramNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(
      StateMachineTypes.STATE_MACHINE, StateMachineTypes.REGION);

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
   public void executeOperation(final CreateNodeOperation operation, final StateMachineModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();

      System.out.println("CONTAINER " + operation.getContainerId());

      switch (operation.getElementTypeId()) {
         case StateMachineTypes.STATE_MACHINE:
            modelAccess.addStateMachine(UmlModelState.getModelState(modelState), operation.getLocation())
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not execute create operation on new State Machine node");
                  }
               });
            break;
         case StateMachineTypes.REGION:
            NamedElement parentContainer = getOrThrow(
               modelIndex.getEObject(operation.getContainerId(), NamedElement.class),
               "No semantic container object found for source element with id " + operation.getContainerId());
            if (parentContainer != null) {
               Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
               Optional<GModelElement> structCompartment = container.filter(GNode.class::isInstance)
                  .map(GNode.class::cast)
                  .flatMap(this::getStructureCompartment);
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(),
                  structCompartment);
               modelAccess.addRegion(UmlModelState.getModelState(modelState), parentContainer,
                  relativeLocation)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not execute create operation on new State Machine node");
                     }
                  });
            }
            break;
      }
   }

   protected Optional<GCompartment> getStructureCompartment(final GNode packageable) {
      return packageable.getChildren().stream().filter(GCompartment.class::isInstance).map(GCompartment.class::cast)
         .filter(comp -> StateMachineTypes.STRUCTURE.equals(comp.getType())).findFirst();
   }

   protected Optional<GPoint> getRelativeLocation(final CreateNodeOperation operation,
      final Optional<GPoint> absoluteLocation, final Optional<GModelElement> container) {
      if (absoluteLocation.isPresent() && container.isPresent()) {
         // When creating elements on a parent node (other than the root Graph),
         // prevent the node from using negative coordinates
         boolean allowNegativeCoordinates = container.get() instanceof GGraph;
         GModelElement modelElement = container.get();
         if (modelElement instanceof GBoundsAware) {
            try {
               GPoint relativePosition = GeometryUtil.absoluteToRelative(absoluteLocation.get(),
                  (GBoundsAware) modelElement);
               GPoint relativeLocation = allowNegativeCoordinates
                  ? relativePosition
                  : GraphUtil.point(Math.max(0, relativePosition.getX()), Math.max(0, relativePosition.getY()));
               return Optional.of(relativeLocation);
            } catch (IllegalArgumentException ex) {
               return absoluteLocation;
            }
         }
      }
      return Optional.empty();
   }

   @Override
   public String getLabel() { return "Create uml state machine"; }
   */
}
