package com.eclipsesource.uml.glsp.operations.objectdiagram;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.*;
import com.google.common.collect.Lists;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.NamedElement;

import java.util.List;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

public class CreateObjectDiagramEdgeOperationHandler
        extends EMSBasicCreateOperationHandler<CreateEdgeOperation, UmlModelServerAccess> {

    public CreateObjectDiagramEdgeOperationHandler() {
        super(handledElementTypeIds);
    }

    private static List<String> handledElementTypeIds = Lists.newArrayList(Types.LINK);

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

        NamedElement source = getOrThrow(modelState.getIndex().getSemantic(sourceId), NamedElement.class,
                "No valid source element with id " + sourceId + " found");
        NamedElement target = getOrThrow(modelState.getIndex().getSemantic(targetId), NamedElement.class,
                "No valid target element with id " + targetId + " found");

        if (Types.LINK.equals(operation.getElementTypeId())) {
            modelAccess.addLink(modelState, (Class) source, (Class) target)
                    .thenAccept(response -> {
                        if (!response.body()) {
                            throw new GLSPServerException("Could not execute create operation on new Association edge");
                        }
                    });
        } else {
            System.out.println("Association could not be created!");
        }
    }

    @Override
    public String getLabel() {
        return "create uml edge";
    }
}