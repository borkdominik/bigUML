package com.eclipsesource.uml.glsp.uml.activity_diagram.operations;

public class CreateActivityDiagramEdgeOperationHandler {
   /*-
   
   public CreateActivityDiagramEdgeOperationHandler() {
      super(handledElementTypeIds);
   }
   
   private static List<String> handledElementTypeIds = Lists.newArrayList(
      ActivityTypes.CONTROLFLOW, ActivityTypes.EXCEPTIONHANDLER);
   
   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateEdgeOperation) {
         CreateEdgeOperation action = (CreateEdgeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }
   
   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }
   
   @Override
   public void executeOperation(final CreateEdgeOperation operation, final ActivityModelServerAccess modelAccess) {
   
      UmlModelState modelState = getUmlModelState();
      String sourceId = operation.getSourceElementId();
      String targetId = operation.getTargetElementId();
   
      switch (operation.getElementTypeId()) {
         case ActivityTypes.EXCEPTIONHANDLER: {
            targetId = targetId.replace("_port", "");
   
            ExecutableNode source = getOrThrow(modelState.getIndex().getEObject(sourceId),
               ExecutableNode.class, "No valid source acivtiy with id " + sourceId + " found");
            Pin target = getOrThrow(modelState.getIndex().getEObject(targetId), Pin.class,
               "No valid pin with id " + targetId + " found");
   
            modelAccess.addExceptionHandler(UmlModelState.getModelState(modelState), source, target)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not execute create operation on new ExceptionHandler edge");
                  }
               });
            break;
         }
         case ActivityTypes.CONTROLFLOW: {
            GModelElement sourceGElem = modelState.getIndex().get(sourceId).get();
            GModelElement targetGElem = modelState.getIndex().get(targetId).get();
            if (ActivityTypes.PIN_PORT.equals(sourceGElem.getType())) {
               sourceId = sourceGElem.getParent().getId();
            }
            if (ActivityTypes.PIN_PORT.equals(targetGElem.getType())) {
               targetId = targetGElem.getParent().getId();
            }
   
            ActivityNode source = getOrThrow(modelState.getIndex().getEObject(sourceId), ActivityNode.class,
               "No valid source activity node with id " + sourceId + " found");
            ActivityNode target = getOrThrow(modelState.getIndex().getEObject(targetId), ActivityNode.class,
               "No valid target activity node with id " + targetId + " found");
   
            modelAccess
               .addControlflow(UmlModelState.getModelState(modelState), source, target)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not execute create operation on new ControlFLow edge");
                  }
               });
            break;
         }
      }
   }
   
   @Override
   public String getLabel() { return "create uml edge"; }
   */
}
