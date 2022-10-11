package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.actions;

public class AddTransitionLabelActionHandler { /*-

   private static Logger logger = LogManager.getLogger(UmlGetTypesActionHandler.class.getSimpleName());

   @Override
   public List<Action> executeAction(final AddTransitionLabelAction actualAction,
      final StateMachineModelServerAccess modelServerAccess) {
      logger.info("Received add transition label action");

      UmlModelState modelState = UmlModelState.getModelState(gModelState);
      EObject semanticElement = getOrThrow(modelState.getIndex().getEObject(actualAction.getElementTypeId()),
         EObject.class,
         "Could not find element for id '" + actualAction.getElementTypeId()
            + "', no add transition label action executed");

      // UmlModelServerAccess modelServerAccess = UmlModelState.getModelServerAccess(gModelState);
      modelServerAccess.addTransitionLabel(modelState, (Transition) semanticElement, "transition label")
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException(
                  "Could not execute add transition label on Transition: " + semanticElement.toString());
            }
         });
      return new ArrayList<>();
   }
   */
}
