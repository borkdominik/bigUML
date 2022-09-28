package com.eclipsesource.uml.glsp.uml.statemachine_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.List;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Vertex;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.StateMachineModelServerAccess;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.constants.StateMachineTypes;
import com.google.common.collect.Lists;

public class CreateStateMachineDiagramEdgeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateEdgeOperation, StateMachineModelServerAccess> {

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

      Vertex source = getOrThrow(modelState.getIndex().getSemantic(sourceId), Vertex.class,
         "No valid source vertex with id " + sourceId + " found!");
      Vertex target = getOrThrow(modelState.getIndex().getSemantic(targetId), Vertex.class,
         "No valid target vertex with id " + targetId + " found!");

      if (elementTypeId.equals(StateMachineTypes.TRANSITION)) {
         modelAccess.addTransition(UmlModelState.getModelState(modelState), source, target)
            .thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute create operation on new Transition edge");
               }
            });
      }
   }

   @Override
   public String getLabel() { return "Create uml edge"; }
}
