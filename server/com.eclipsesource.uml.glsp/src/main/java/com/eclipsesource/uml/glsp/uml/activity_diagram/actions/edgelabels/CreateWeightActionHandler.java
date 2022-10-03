package com.eclipsesource.uml.glsp.uml.activity_diagram.actions.edgelabels;

public class CreateWeightActionHandler {
   /*-
   private static Logger LOGGER = LogManager.getLogger(UmlGetTypesActionHandler.class.getSimpleName());
   
   private UmlModelState modelState;
   
   public List<Action> executeAction(final CreateWeightAction createWeightAction,
      final ActivityModelServerAccess modelServerAccess) {
      LOGGER.info("Recieved create weight request");
      EObject semanticElement = getOrThrow(modelState.getIndex().getEObject(createWeightAction.getElementTypeId()),
         EObject.class,
         "Could not find element for id '" + createWeightAction.getElementTypeId()
            + "', no create weight action executed");
   
      modelServerAccess.setWeight(modelState, (ControlFlow) semanticElement, "weigth").thenAccept(response -> {
         if (response.body() == null || response.body().isEmpty()) {
            throw new GLSPServerException(
               "Could not execute remove Guard operation on ActivityEdge: " + semanticElement.toString());
         }
      });
      return new ArrayList<>();
   }
   */
}
