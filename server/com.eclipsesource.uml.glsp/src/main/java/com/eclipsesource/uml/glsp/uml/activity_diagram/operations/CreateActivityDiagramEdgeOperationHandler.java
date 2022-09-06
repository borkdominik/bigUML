package com.eclipsesource.uml.glsp.uml.activity_diagram.operations;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ExecutableNode;
import org.eclipse.uml2.uml.Pin;

import java.util.List;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

public class CreateActivityDiagramEdgeOperationHandler
        extends EMSBasicCreateOperationHandler<CreateEdgeOperation, UmlModelServerAccess> {

    public CreateActivityDiagramEdgeOperationHandler() {
        super(handledElementTypeIds);
    }

    private static List<String> handledElementTypeIds = Lists.newArrayList(
            Types.CONTROLFLOW, Types.EXCEPTIONHANDLER
    );

    @Override
    public boolean handles(final Operation execAction) {
        if (execAction instanceof CreateEdgeOperation) {
            CreateEdgeOperation action = (CreateEdgeOperation) execAction;
            return handledElementTypeIds.contains(action.getElementTypeId());
        }
        return false;
    }

    protected UmlModelState getUmlModelState() {
        return (UmlModelState) getEMSModelState();
    }

    @Override
    public void executeOperation(final CreateEdgeOperation operation, final UmlModelServerAccess modelAccess) {

        UmlModelState modelState = getUmlModelState();
        String sourceId = operation.getSourceElementId();
        String targetId = operation.getTargetElementId();

        switch (operation.getElementTypeId()) {
            case Types.EXCEPTIONHANDLER: {
                targetId = targetId.replace("_port", "");

                ExecutableNode source = getOrThrow(modelState.getIndex().getSemantic(sourceId),
                        ExecutableNode.class, "No valid source acivtiy with id " + sourceId + " found");
                Pin target = getOrThrow(modelState.getIndex().getSemantic(targetId), Pin.class,
                        "No valid pin with id " + targetId + " found");

                modelAccess.addExceptionHandler(UmlModelState.getModelState(modelState), source, target)
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not execute create operation on new ExceptionHandler edge");
                            }
                        });
                break;
            }
            case Types.CONTROLFLOW: {
                GModelElement sourceGElem = modelState.getIndex().get(sourceId).get();
                GModelElement targetGElem = modelState.getIndex().get(targetId).get();
                if (Types.PIN_PORT.equals(sourceGElem.getType())) {
                    sourceId = sourceGElem.getParent().getId();
                }
                if (Types.PIN_PORT.equals(targetGElem.getType())) {
                    targetId = targetGElem.getParent().getId();
                }

                ActivityNode source = getOrThrow(modelState.getIndex().getSemantic(sourceId), ActivityNode.class,
                        "No valid source activity node with id " + sourceId + " found");
                ActivityNode target = getOrThrow(modelState.getIndex().getSemantic(targetId), ActivityNode.class,
                        "No valid target activity node with id " + targetId + " found");

                modelAccess
                        .addControlflow(UmlModelState.getModelState(modelState), source, target)
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not execute create operation on new ControlFLow edge");
                            }
                        });
                break;
            }
        }
    }

    @Override
    public String getLabel() {
        return "create uml edge";
    }
}
