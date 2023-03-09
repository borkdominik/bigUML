package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.actions;

public class AddTransitionEffectActionHandler { /*-

   private static Logger logger = LogManager.getLogger(UmlGetTypesActionHandler.class.getSimpleName());

   @Override
   public List<Action> executeAction(final AddTransitionEffectAction addTransitionEffectAction,
      final StateMachineModelServerAccess modelServerAccess) {
      logger.info("Received add transition effect action");

      UmlModelState modelState = UmlModelState.getModelState(gModelState);
      EObject semanticElement = getOrThrow(
         modelState.getIndex().getEObject(addTransitionEffectAction.getElementTypeId()),
         EObject.class,
         "Could not find element for id '" + addTransitionEffectAction.getElementTypeId()
            + "', no add transition effect action executed");

      modelServerAccess.addTransitionEffect(modelState, (Transition) semanticElement, "transition effect")
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException(
                  "Could not execute add transition effect operation on Transition: " + semanticElement.toString());
            }
         });
      return new ArrayList<>();
   }
   */
}
