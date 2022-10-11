package com.eclipsesource.uml.glsp.old.diagram.object_diagram.operations;

public class CreateObjectDiagramEdgeOperationHandler { /*-

   public CreateObjectDiagramEdgeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(ObjectTypes.LINK);

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
   public void executeOperation(final CreateEdgeOperation operation, final ObjectModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();

      String sourceId = operation.getSourceElementId();
      String targetId = operation.getTargetElementId();

      NamedElement source = getOrThrow(modelState.getIndex().getEObject(sourceId), NamedElement.class,
         "No valid source element with id " + sourceId + " found");
      NamedElement target = getOrThrow(modelState.getIndex().getEObject(targetId), NamedElement.class,
         "No valid target element with id " + targetId + " found");

      if (ObjectTypes.LINK.equals(operation.getElementTypeId())) {
         modelAccess.addLink(modelState, (Class) source, (Class) target)
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute create operation on new Association edge");
               }
            });
      } else {
         System.out.println("Association could not be created!");
      }
   }

   @Override
   public String getLabel() { return "create uml edge"; }
   */
}
