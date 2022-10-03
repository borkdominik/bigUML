package com.eclipsesource.uml.glsp.uml.statemachine_diagram.operations;

public class CreateStateMachineDiagramEdgeOperationHandler { /*-

   public CreateStateMachineDiagramEdgeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(StateMachineTypes.TRANSITION);

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
   public void executeOperation(final CreateEdgeOperation operation, final StateMachineModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();
      String elementTypeId = operation.getElementTypeId();

      String sourceId = operation.getSourceElementId();
      String targetId = operation.getTargetElementId();

      Vertex source = getOrThrow(modelState.getIndex().getEObject(sourceId), Vertex.class,
         "No valid source vertex with id " + sourceId + " found!");
      Vertex target = getOrThrow(modelState.getIndex().getEObject(targetId), Vertex.class,
         "No valid target vertex with id " + targetId + " found!");

      if (elementTypeId.equals(StateMachineTypes.TRANSITION)) {
         modelAccess.addTransition(UmlModelState.getModelState(modelState), source, target)
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute create operation on new Transition edge");
               }
            });
      }
   }

   @Override
   public String getLabel() { return "Create uml edge"; }
   */
}
