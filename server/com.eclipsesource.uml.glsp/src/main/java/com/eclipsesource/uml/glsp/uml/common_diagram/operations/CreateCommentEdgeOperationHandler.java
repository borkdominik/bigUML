package com.eclipsesource.uml.glsp.uml.common_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.List;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.LinkCommentCommandContribution;
import com.google.common.collect.Lists;

public class CreateCommentEdgeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateEdgeOperation, UmlModelServerAccess> {

   public CreateCommentEdgeOperationHandler() {
      super(handledElementTypeIds);
   }

   public static List<String> handledElementTypeIds = Lists.newArrayList(Types.COMMENT_EDGE);

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
   public void executeOperation(final CreateEdgeOperation operation, final UmlModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();

      String sourceId = operation.getSourceElementId();
      String targetId = operation.getTargetElementId();

      if (Types.COMMENT_EDGE.equals(operation.getElementTypeId())) {
         Comment source = getOrThrow(modelState.getIndex().getSemantic(sourceId), Comment.class,
            "No valid source comment with id " + sourceId + " found");
         Element target = getOrThrow(modelState.getIndex().getSemantic(targetId), Element.class,
            "No valid target element with id " + sourceId + " found");

         modelAccess.exec(LinkCommentCommandContribution.create(source, target))
            .thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute link comment operation");
               }
            });
      }
   }

   @Override
   public String getLabel() { return "Create comment edge"; }
}
