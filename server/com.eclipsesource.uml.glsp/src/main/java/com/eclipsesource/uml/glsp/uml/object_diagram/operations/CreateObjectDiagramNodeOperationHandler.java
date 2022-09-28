package com.eclipsesource.uml.glsp.uml.object_diagram.operations;

import java.util.List;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.object_diagram.ObjectModelServerAccess;
import com.eclipsesource.uml.glsp.uml.object_diagram.constants.ObjectTypes;
import com.google.common.collect.Lists;

public class CreateObjectDiagramNodeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateNodeOperation, ObjectModelServerAccess> {

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
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute create operation on Object node");
               }
            });
      }
   }

   @Override
   public String getLabel() { return "Create uml classifier"; }
}
