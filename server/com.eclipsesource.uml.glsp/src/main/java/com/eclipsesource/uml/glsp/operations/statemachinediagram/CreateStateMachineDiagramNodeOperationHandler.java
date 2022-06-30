package com.eclipsesource.uml.glsp.operations.statemachinediagram;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.StateMachine;

import java.util.List;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;


public class CreateStateMachineDiagramNodeOperationHandler
      extends EMSBasicCreateOperationHandler<CreateNodeOperation, UmlModelServerAccess> {

   public CreateStateMachineDiagramNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(
         Types.STATE_MACHINE, Types.REGION);

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateNodeOperation) {
         CreateNodeOperation action = (CreateNodeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   protected UmlModelState getUmlModelState() {
      return (UmlModelState) getEMSModelState();
   }

   @Override
   public void executeOperation(final CreateNodeOperation operation, final UmlModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();

      switch (operation.getElementTypeId()) {
         case Types.STATE_MACHINE:
            modelAccess.addStateMachine(UmlModelState.getModelState(modelState), operation.getLocation())
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new State Machine node");
                     }
                  });
            break;
         case Types.REGION:
            StateMachine parentContainer = getOrThrow(
                  modelIndex.getSemantic(operation.getContainerId(), StateMachine.class),
                  "No semantic container object found for source element with id " + operation.getContainerId());
            modelAccess.addRegion(UmlModelState.getModelState(modelState), parentContainer,
                        operation.getLocation().orElse(GraphUtil.point(0, 0)))
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new State Machine node");
                     }
                  });
            break;
      }
   }

   @Override
   public String getLabel() {
      return "Create uml state machine";
   }
}
