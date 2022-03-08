package com.eclipsesource.uml.glsp.operations.statemachinediagram;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.*;

import java.util.List;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

public class CreateStateMachineDiagramChildNodeOperationHandler
        extends EMSBasicCreateOperationHandler<CreateNodeOperation, UmlModelServerAccess> {

    public CreateStateMachineDiagramChildNodeOperationHandler() {
        super(handledElementTypeIds);
    }

    private static List<String> handledElementTypeIds = List.of(Types.STATE, Types.INITIAL_STATE, Types.DEEP_HISTORY,
            Types.SHALLOW_HISTORY, Types.JOIN, Types.FORK, Types.JUNCTION, Types.CHOICE, Types.ENTRY_POINT,
            Types.EXIT_POINT, Types.TERMINATE, Types.FINAL_STATE);

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
        String containerId = operation.getContainerId();
        String elementTypeId = operation.getElementTypeId();

        StateMachine containerStateMachine = getOrThrow(modelState.getIndex().getSemantic(containerId), StateMachine.class,
                "No valid State Machine container with id " + operation.getContainerId() + " found");

        /*Shape shapeContainer = modelState.getIndex().getNotation(containerStateMachine, Shape.class).orElse(null);

        assert shapeContainer != null;
        GPoint containerPosition = shapeContainer.getPosition();
        GPoint createPosition = GraphUtil.point(0,0);


        if (operation.getLocation().isPresent()) {
            createPosition.setX(operation.getLocation().get().getX() - containerPosition.getX());
            createPosition.setY(operation.getLocation().get().getY() - containerPosition.getY());
        }*/

        Region region = containerStateMachine.getRegions().get(0);

        GPoint createPosition = getPosition(modelState, containerStateMachine, operation.getLocation().orElse(GraphUtil.point(0,0)));
        if (Types.STATE.equals(elementTypeId)) {
            modelAccess.addState(UmlModelState.getModelState(modelState), region, createPosition)
                    .thenAccept(response -> {
                        if (!response.body()) {
                            throw new GLSPServerException("Could not execute create operation on new State node");
                        }
                    });
        } else if (Types.PSEUDOSTATES.contains(elementTypeId)) {
            modelAccess
                    .addPseudostate(UmlModelState.getModelState(modelState), region, getPseudostateKind(elementTypeId),
                            createPosition)
                    .thenAccept(response -> {
                        if (!response.body()) {
                            throw new GLSPServerException("Could not execute create operation on new Pseudostate node");
                        }
                    });
        } else if (Types.FINAL_STATE.equals(elementTypeId)) {
            modelAccess.addFinalState(UmlModelState.getModelState(modelState), region, createPosition)
                    .thenAccept(response -> {
                        if (!response.body()) {
                            throw new GLSPServerException("Could not execute create operation on new Final State node");
                        }
                    });
        }
    }

    private GPoint getPosition(final UmlModelState modelState, final Element container, final GPoint position) {
        System.out.println("CONTAINER TYPE: " + container.eClass().getName());
        //Shape containerShape = modelState.getIndex().getNotation(container, Shape.class).get();

        //Shape containerShape = modelState.getIndex().getNotation(container, Shape.class).orElse(null);

        Shape containerShape = getOrThrow(modelState.getIndex().getNotation(container), Shape.class,
                "No valid State Machine container found");

        double x = position.getX();
        double y = position.getY();

        x = Math.max(0, x - containerShape.getPosition().getX());
        y = Math.max(0, y - containerShape.getPosition().getY() - 43);
        //GPoint location = GraphUtil.point(x, y);

        /*x = Math.max(0, x - containerShape.getPosition().getX());
        y = Math.max(0, y - containerShape.getPosition().getY() - 43);
        GPoint location = GraphUtil.point(x, y);
        GDimension newShape = new GDimensionImpl();

        if (container instanceof StateMachine) {
            System.out.println("---------goes in container loop!!!---------");
            double shapeHeight = containerShape.getSize().getHeight();
            double shapeWidth = containerShape.getSize().getWidth();
            newShape.setHeight((shapeHeight + 100) * 2);
            newShape.setHeight((shapeWidth + 200) * 2);
            //System.out.println("-------newShape height : " + newShape.getHeight());
            //System.out.println("-------newShape width : " + newShape.getWidth());
            containerShape.setSize(newShape);
            System.out.println("-------container height : " + containerShape.getSize().getHeight());
            System.out.println("-------container width : " + containerShape.getSize().getWidth());*/

        if (container instanceof StateMachine) {
            return GraphUtil.point(x - 16, y - 8);
        }
        return GraphUtil.point(0, 0);
    }

    private PseudostateKind getPseudostateKind(final String type) {
        switch (type) {
            case Types.INITIAL_STATE:
                return PseudostateKind.INITIAL_LITERAL;
            case Types.DEEP_HISTORY:
                return PseudostateKind.DEEP_HISTORY_LITERAL;
            case Types.SHALLOW_HISTORY:
                return PseudostateKind.SHALLOW_HISTORY_LITERAL;
            case Types.JOIN:
                return PseudostateKind.JOIN_LITERAL;
            case Types.FORK:
                return PseudostateKind.FORK_LITERAL;
            case Types.JUNCTION:
                return PseudostateKind.JUNCTION_LITERAL;
            case Types.CHOICE:
                return PseudostateKind.CHOICE_LITERAL;
            case Types.ENTRY_POINT:
                return PseudostateKind.ENTRY_POINT_LITERAL;
            case Types.EXIT_POINT:
                return PseudostateKind.EXIT_POINT_LITERAL;
            case Types.TERMINATE:
                return PseudostateKind.TERMINATE_LITERAL;
            default:
                return null;
        }
    }

    @Override
    public String getLabel() { return "Create Classifier child node"; }
}
