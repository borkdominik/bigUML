package com.eclipsesource.uml.glsp.old.diagram.object_diagram.operations;

public class CreateObjectDiagramChildNodeOperationHandler { /*-

   public CreateObjectDiagramChildNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = List.of(ObjectTypes.ATTRIBUTE);

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
   public void executeOperation(final CreateNodeOperation operation, final ObjectModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();

      String containerId = operation.getContainerId();
      String elementTypeId = operation.getElementTypeId();

      PackageableElement container = getOrThrow(modelState.getIndex().getEObject(containerId),
         PackageableElement.class, "No valid container with id " + operation.getContainerId() + " found");

      if (elementTypeId.equals(ObjectTypes.ATTRIBUTE) && container instanceof Class) {
         modelAccess.addAttribute(UmlModelState.getModelState(modelState), (Class) container)
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute create operation on new Property node");
               }
            });
      }

   }

   @Override
   public String getLabel() { return "Create Classifier child node"; }
   */
}
