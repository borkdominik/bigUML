package com.eclipsesource.uml.glsp.old.diagram.activity_diagram.operations;

public class CreateActivityDiagramNodeOperationHandler {
   /*-
   
   
   public CreateActivityDiagramNodeOperationHandler() {
      super(handledElementTypeIds);
   }
   
   private static List<String> handledElementTypeIds = Lists.newArrayList(
      ActivityTypes.ACTIVITY, ActivityTypes.INTERRUPTIBLEREGION, ActivityTypes.PARTITION);
   
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
   public void executeOperation(final CreateNodeOperation operation, final ActivityModelServerAccess modelAccess) {
   
      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();
   
      NamedElement parentContainer = getOrThrow(
         modelIndex.getEObject(operation.getContainerId(), NamedElement.class),
         "No parent container found!");
   
      switch (operation.getElementTypeId()) {
         case ActivityTypes.ACTIVITY: {
            modelAccess.addActivity(UmlModelState.getModelState(modelState), operation.getLocation())
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not execute create operation on new Activity node");
                  }
               });
            break;
         }
         case ActivityTypes.PARTITION: {
            // TODO: Check if the parenting is semantically correct
            if (parentContainer instanceof Activity ||
               parentContainer instanceof ActivityPartition ||
               parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(),
                  getStructureCompartmentGModelElement(container));
               modelAccess.addPartition(UmlModelState.getModelState(modelState), relativeLocation, parentContainer)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not execute create operation on new Partition node");
                     }
                  });
            }
            break;
         }
         case ActivityTypes.INTERRUPTIBLEREGION: {
            // TODO: Check if the parenting is semantically correct
            if (parentContainer instanceof Activity ||
               parentContainer instanceof ActivityPartition ||
               parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(),
                  getStructureCompartmentGModelElement(container));
               modelAccess
                  .addInterruptibleRegion(UmlModelState.getModelState(modelState), relativeLocation, parentContainer)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not execute create operation on new Activity node");
                     }
                  });
            }
            break;
         }
      }
   }
   
   protected Optional<GModelElement> getStructureCompartmentGModelElement(final Optional<GModelElement> container) {
      return container.filter(GNode.class::isInstance)
         .map(GNode.class::cast)
         .flatMap(this::getStructureCompartment);
   }
   
   protected Optional<GCompartment> getStructureCompartment(final GNode packageable) {
      return packageable.getChildren().stream().filter(GCompartment.class::isInstance).map(GCompartment.class::cast)
         .filter(comp -> ActivityTypes.STRUCTURE.equals(comp.getType())).findFirst();
   }
   
   protected Optional<GPoint> getRelativeLocation(final CreateNodeOperation operation,
      final Optional<GPoint> absoluteLocation,
      final Optional<GModelElement> container) {
      if (absoluteLocation.isPresent() && container.isPresent()) {
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
   public String getLabel() { return "Create uml classifier"; }
   */
}
