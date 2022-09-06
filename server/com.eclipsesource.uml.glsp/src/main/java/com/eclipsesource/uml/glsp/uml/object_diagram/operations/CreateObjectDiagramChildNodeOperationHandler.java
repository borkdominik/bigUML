package com.eclipsesource.uml.glsp.uml.object_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.List;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.object_diagram.ObjectModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;

public class CreateObjectDiagramChildNodeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateNodeOperation, ObjectModelServerAccess> {

   public CreateObjectDiagramChildNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = List.of(Types.ATTRIBUTE);

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

      PackageableElement container = getOrThrow(modelState.getIndex().getSemantic(containerId),
         PackageableElement.class, "No valid container with id " + operation.getContainerId() + " found");

      if (elementTypeId.equals(Types.ATTRIBUTE) && container instanceof Class) {
         modelAccess.addAttribute(UmlModelState.getModelState(modelState), (Class) container)
            .thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute create operation on new Property node");
               }
            });
      }

   }

   @Override
   public String getLabel() { return "Create Classifier child node"; }
}
