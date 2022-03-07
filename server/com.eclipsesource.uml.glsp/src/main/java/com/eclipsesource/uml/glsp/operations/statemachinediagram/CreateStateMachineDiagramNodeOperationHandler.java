package com.eclipsesource.uml.glsp.operations.statemachinediagram;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;

import java.util.List;


public class CreateStateMachineDiagramNodeOperationHandler
        extends EMSBasicCreateOperationHandler<CreateNodeOperation, UmlModelServerAccess> {

    public CreateStateMachineDiagramNodeOperationHandler() {
        super(handledElementTypeIds);
    }

    private static List<String> handledElementTypeIds = Lists.newArrayList(Types.STATE_MACHINE);

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

        if (Types.STATE_MACHINE.equals(operation.getElementTypeId())) {
            modelAccess.addStateMachine(UmlModelState.getModelState(modelState), operation.getLocation())
                    .thenAccept(response -> {
                        if (!response.body()) {
                            throw new GLSPServerException("Could not execute create operation on new State Machine node");
                        }
                    });
        }
    }

    @Override
    public String getLabel() {
        return "Create uml state machine";
    }
}
