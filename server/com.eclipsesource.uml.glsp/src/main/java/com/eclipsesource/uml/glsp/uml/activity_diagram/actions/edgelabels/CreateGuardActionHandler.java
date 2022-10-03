package com.eclipsesource.uml.glsp.uml.activity_diagram.actions.edgelabels;

public class CreateGuardActionHandler {
   /*-
   private static Logger LOGGER = LogManager.getLogger(UmlGetTypesActionHandler.class.getSimpleName());
   
   private UmlModelState modelState;
   
   public List<Action> executeAction(final CreateGuardAction createGuardAction,
      final ActivityModelServerAccess modelServerAccess) {
      LOGGER.info("Recieved create guard request");
      EObject semanticElement = getOrThrow(modelState.getIndex().getEObject(createGuardAction.getElementTypeId()),
         EObject.class,
         "Could not find element for id '" + createGuardAction.getElementTypeId()
            + "', no create guard action executed");
   
      modelServerAccess.setGuard(modelState, (ControlFlow) semanticElement, "guard").thenAccept(response -> {
         if (response.body() == null || response.body().isEmpty()) {
            throw new GLSPServerException(
               "Could not execute remove Guard operation on ActivityEdge: " + semanticElement.toString());
         }
      });
      return new ArrayList<>();
   }
   */
}
