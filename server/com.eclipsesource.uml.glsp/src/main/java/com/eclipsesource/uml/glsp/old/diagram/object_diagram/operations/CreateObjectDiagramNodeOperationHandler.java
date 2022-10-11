package com.eclipsesource.uml.glsp.old.diagram.object_diagram.operations;

public class CreateObjectDiagramNodeOperationHandler { /*-

   public CreateObjectDiagramNodeOperationHandler() {
      super(handledElmentTypeIds);
   }

   private static final List<String> handledElmentTypeIds = Lists.newArrayList(
      ObjectTypes.OBJECT);

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateNodeOperation) {
         CreateNodeOperation action = (CreateNodeOperation) execAction;
         return handledElmentTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final CreateNodeOperation operation, final ObjectModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();

      if (ObjectTypes.OBJECT.equals(operation.getElementTypeId())) {
         System.out.println("in object handler");
         modelAccess.addObject(UmlModelState.getModelState(modelState), operation.getLocation())
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute create operation on Object node");
               }
            });
      }
   }

   @Override
   public String getLabel() { return "Create uml classifier"; }
   */
}
