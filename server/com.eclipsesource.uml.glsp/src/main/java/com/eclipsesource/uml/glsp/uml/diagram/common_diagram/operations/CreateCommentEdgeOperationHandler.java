package com.eclipsesource.uml.glsp.uml.diagram.common_diagram.operations;

public class CreateCommentEdgeOperationHandler { /*-
   extends AbstractEMSOperationHandler<CreateEdgeOperation> {
   public static List<String> handledElementTypeIds = Lists.newArrayList(CommonTypes.COMMENT_EDGE);

   @Inject
   protected UmlModelState modelState;

   @Inject
   private UmlModelServerAccess modelServerAccess;

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateEdgeOperation) {
         CreateEdgeOperation action = (CreateEdgeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   @Override
   public void executeOperation(final CreateEdgeOperation operation) {
      /*-

      String sourceId = operation.getSourceElementId();
      String targetId = operation.getTargetElementId();

      if (CommonTypes.COMMENT_EDGE.equals(operation.getElementTypeId())) {
         Comment source = getOrThrow(modelState.getIndex().getEObject(sourceId), Comment.class,
            "No valid source comment with id " + sourceId + " found");
         Element target = getOrThrow(modelState.getIndex().getEObject(targetId), Element.class,
            "No valid target element with id " + sourceId + " found");

         modelServerAccess.exec(LinkCommentCommandContribution.create(source, target))
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute link comment operation");
               }
            });
      }
      *
   }

   @Override
   public String getLabel() { return "Create comment edge"; }
   */
}
