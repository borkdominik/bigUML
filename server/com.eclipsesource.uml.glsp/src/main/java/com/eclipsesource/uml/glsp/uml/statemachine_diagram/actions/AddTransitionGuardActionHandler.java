package com.eclipsesource.uml.glsp.uml.statemachine_diagram.actions;

public class AddTransitionGuardActionHandler { /*-
   private static Logger logger = LogManager.getLogger(UmlGetTypesActionHandler.class.getSimpleName());

   @Override
   public List<Action> executeAction(final AddTransitionGuardAction addTransitionGuardAction,
      final StateMachineModelServerAccess modelServerAccess) {
      logger.info("Received add transition guard action");
      UmlModelState modelState = UmlModelState.getModelState(gModelState);
      EObject semanticElement = getOrThrow(
         modelState.getIndex().getEObject(addTransitionGuardAction.getElementTypeId()),
         EObject.class,
         "Could not find element for id '" +
            addTransitionGuardAction.getElementTypeId()
            + "', no add transition guard action executed");
      modelServerAccess.addTransitionGuard(modelState, (Transition) semanticElement, "transition guard")
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException(
                  "Could not execute add transition guard operation on Transition: " +
                     semanticElement.toString());
            }
         });
      return new ArrayList<>();
   }
   */
}
