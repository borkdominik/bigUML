package com.eclipsesource.uml.glsp.uml.object_diagram.operations;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.*;
import com.google.common.collect.Lists;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;

import java.util.List;

public class CreateObjectDiagramNodeOperationHandler
    extends EMSBasicCreateOperationHandler<CreateNodeOperation, UmlModelServerAccess> {

    public CreateObjectDiagramNodeOperationHandler() {
        super(handledElmentTypeIds);
    }

    private static final List<String> handledElmentTypeIds = Lists.newArrayList(
            Types.OBJECT
    );

    @Override
    public boolean handles(final Operation execAction) {
        if (execAction instanceof CreateNodeOperation) {
            CreateNodeOperation action = (CreateNodeOperation) execAction;
            return handledElmentTypeIds.contains(action.getElementTypeId());
        }
        return false;
    }

    protected UmlModelState getUmlModelState() {
        return (UmlModelState) getEMSModelState();
    }

    @Override
    public void executeOperation(final CreateNodeOperation operation, final UmlModelServerAccess modelAccess) {

        UmlModelState modelState = getUmlModelState();

        if(Types.OBJECT.equals(operation.getElementTypeId())) {
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
    public String getLabel() {
        return "Create uml classifier";
    }
}
