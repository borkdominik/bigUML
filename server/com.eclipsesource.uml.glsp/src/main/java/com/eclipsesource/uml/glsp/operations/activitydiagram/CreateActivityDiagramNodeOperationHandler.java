package com.eclipsesource.uml.glsp.operations.activitydiagram;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.common.collect.Lists;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;

import java.util.List;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

public class CreateActivityDiagramNodeOperationHandler
        extends EMSBasicCreateOperationHandler<CreateNodeOperation, UmlModelServerAccess> {

    public CreateActivityDiagramNodeOperationHandler() {
        super(handledElementTypeIds);
    }

    private static List<String> handledElementTypeIds = Lists.newArrayList(
            Types.ACTIVITY, Types.INTERRUPTIBLEREGION, Types.PARTITION
    );

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

        switch (operation.getElementTypeId()) {
            case Types.ACTIVITY : {
                modelAccess.addActivity(UmlModelState.getModelState(modelState), operation.getLocation())
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not execute create operation on new Activity node");
                            }
                        });
                break;
            }

            case Types.PARTITION: {
                String containerId = operation.getContainerId();
                Shape containerShape = getOrThrow(modelState.getIndex().getNotation(containerId, Shape.class),
                        "No valid Shape container with id " + containerId + " found");
                EObject container = getOrThrow(modelState.getIndex().getSemantic(containerId),
                        "No valid partition container with id " + containerId + " found");
                double x = operation.getLocation().orElse(GraphUtil.point(0, 0)).getX();
                double y = operation.getLocation().orElse(GraphUtil.point(0, 0)).getY();
                x = Math.max(0, x - containerShape.getPosition().getX() - 72.5);
                y = Math.max(0, y - containerShape.getPosition().getY() - 32);
                GPoint location = GraphUtil.point(x, y);
                modelAccess.addPartition(UmlModelState.getModelState(modelState), location, container)
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not execute create operation on new Activity node");
                            }
                        });
                break;
            }

            case Types.INTERRUPTIBLEREGION: {
                String containerId = operation.getContainerId();
                Shape containerShape = getOrThrow(modelState.getIndex().getNotation(containerId, Shape.class),
                        "No valid Shape container with id " + containerId + " found");
                EObject container = getOrThrow(modelState.getIndex().getSemantic(containerId),
                        "No valid partition container with id " + containerId + " found");


                /*GDimension newSize = new GDimensionImpl();
                newSize.setHeight(containerShape.getSize().getHeight() * 2);
                newSize.setWidth(containerShape.getSize().getWidth() * 2);
                containerShape.setSize(newSize);*/

                double x = operation.getLocation().orElse(GraphUtil.point(0, 0)).getX();
                double y = operation.getLocation().orElse(GraphUtil.point(0, 0)).getY();
                x = Math.max(0, x - containerShape.getPosition().getX() - 64);
                y = Math.max(0, y - containerShape.getPosition().getY() - 64);
                GPoint location = GraphUtil.point(x, y);



                modelAccess.addInterruptibleRegion(UmlModelState.getModelState(modelState), location, container)
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not execute create operation on new Activity node");
                            }
                        });
                break;
            }
        }
    }

    @Override
    public String getLabel() {
        return "Create uml classifier";
    }
}
