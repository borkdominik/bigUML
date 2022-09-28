package com.eclipsesource.uml.glsp.uml.statemachine_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.List;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.State;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.StateMachineModelServerAccess;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.constants.StateMachineTypes;

public class CreateStateMachineDiagramStateChildNodeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateNodeOperation, StateMachineModelServerAccess> {

   public CreateStateMachineDiagramStateChildNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = List.of(
      StateMachineTypes.STATE_ENTRY_ACTIVITY, StateMachineTypes.STATE_DO_ACTIVITY,
      StateMachineTypes.STATE_EXIT_ACTIVITY);

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
   public void executeOperation(final CreateNodeOperation operation, final StateMachineModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();

      String containerId = operation.getContainerId();
      String elementTypeId = operation.getElementTypeId();

      State container = getOrThrow(modelState.getIndex().getSemantic(containerId), State.class,
         "No valid state container with id " + operation.getContainerId() + " found");

      switch (elementTypeId) {
         case StateMachineTypes.STATE_ENTRY_ACTIVITY:
            modelAccess
               .addBehaviorToState(modelState, container, StateMachineTypes.STATE_ENTRY_ACTIVITY)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not execute create state entry activity");
                  }
               });
            break;
         case StateMachineTypes.STATE_DO_ACTIVITY:
            modelAccess
               .addBehaviorToState(modelState, container, StateMachineTypes.STATE_DO_ACTIVITY)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not execute create state do activity");
                  }
               });
            break;
         case StateMachineTypes.STATE_EXIT_ACTIVITY:
            modelAccess
               .addBehaviorToState(modelState, container, StateMachineTypes.STATE_EXIT_ACTIVITY)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not execute create state exit activity");
                  }
               });
            break;
      }
   }

   @Override
   public String getLabel() { return "Create state child node"; }
}
