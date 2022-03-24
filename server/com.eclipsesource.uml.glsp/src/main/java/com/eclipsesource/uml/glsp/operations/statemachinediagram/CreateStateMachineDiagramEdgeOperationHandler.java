package com.eclipsesource.uml.glsp.operations.statemachinediagram;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Vertex;

import java.util.List;

public class CreateStateMachineDiagramEdgeOperationHandler
        extends EMSBasicCreateOperationHandler<CreateEdgeOperation, UmlModelServerAccess> {

    public CreateStateMachineDiagramEdgeOperationHandler() {
        super(handledElementTypeIds);
    }

    private static List<String> handledElementTypeIds = Lists.newArrayList(Types.TRANSITION);

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
        String elementTypeId = operation.getElementTypeId();

        String sourceId = operation.getSourceElementId();
        String targetId = operation.getTargetElementId();

        Vertex source = getOrThrow(modelState.getIndex().getSemantic(sourceId), Vertex.class,
                "No valid source vertex with id " + sourceId + " found!");
        Vertex target = getOrThrow(modelState.getIndex().getSemantic(targetId), Vertex.class,
                "No valid target vertex with id " + targetId + " found!");

        if (elementTypeId.equals(Types.TRANSITION)) {
            modelAccess.addTransition(UmlModelState.getModelState(modelState), source, target)
                    .thenAccept(response -> {
                        if (!response.body()) {
                            throw new GLSPServerException("Could not execute create operation on new Transition edge");
                        }
                    });
        }
    }

    @Override
    public String getLabel() {
        return "Create uml edge";
    }
}
