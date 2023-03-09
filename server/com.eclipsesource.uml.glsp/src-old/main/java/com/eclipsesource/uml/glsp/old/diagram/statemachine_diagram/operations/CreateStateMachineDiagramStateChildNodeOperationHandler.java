package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.operations;

public class CreateStateMachineDiagramStateChildNodeOperationHandler { /*-

   public CreateStateMachineDiagramStateChildNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = List.of(
      StateMachineTypes.STATE_ENTRY_ACTIVITY, StateMachineTypes.STATE_DO_ACTIVITY,
      StateMachineTypes.STATE_EXIT_ACTIVITY);

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

      String containerId = operation.getContainerId();
      String elementTypeId = operation.getElementTypeId();

      State container = getOrThrow(modelState.getIndex().getEObject(containerId), State.class,
         "No valid state container with id " + operation.getContainerId() + " found");

      switch (elementTypeId) {
         case StateMachineTypes.STATE_ENTRY_ACTIVITY:
            modelAccess
               .addBehaviorToState(modelState, container, StateMachineTypes.STATE_ENTRY_ACTIVITY)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not execute create state entry activity");
                  }
               });
            break;
         case StateMachineTypes.STATE_DO_ACTIVITY:
            modelAccess
               .addBehaviorToState(modelState, container, StateMachineTypes.STATE_DO_ACTIVITY)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not execute create state do activity");
                  }
               });
            break;
         case StateMachineTypes.STATE_EXIT_ACTIVITY:
            modelAccess
               .addBehaviorToState(modelState, container, StateMachineTypes.STATE_EXIT_ACTIVITY)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not execute create state exit activity");
                  }
               });
            break;
      }
   }

   @Override
   public String getLabel() { return "Create state child node"; }
   */
}
