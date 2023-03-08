package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.actions;

public class AddTransitionTriggerActionHandler { /*-

   private static Logger logger = LogManager.getLogger(UmlGetTypesActionHandler.class.getSimpleName());

   @Override
   public List<Action> executeAction(final AddTransitionTriggerAction addTransitionTriggerAction,
      final StateMachineModelServerAccess modelServerAccess) {
      logger.info("Received add transition trigger action");

      UmlModelState modelState = UmlModelState.getModelState(gModelState);
      EObject semanticElement = getOrThrow(
         modelState.getIndex().getEObject(addTransitionTriggerAction.getElementTypeId()),
         EObject.class,
         "Could not find element for id '" + addTransitionTriggerAction.getElementTypeId()
            + "', no add transition trigger action executed");

      modelServerAccess.addTransitionTrigger(modelState, (Transition) semanticElement, "transition trigger")
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException(
                  "Could not execute add transition trigger operation on Transition: " + semanticElement.toString());
            }
         });
      return new ArrayList<>();
   }
   */
}
