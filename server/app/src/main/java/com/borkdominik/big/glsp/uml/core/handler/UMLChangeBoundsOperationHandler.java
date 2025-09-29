package com.borkdominik.big.glsp.uml.core.handler;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.command.SetCommand;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.NotationPackage;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.glsp.server.operations.ChangeBoundsOperation;
import org.eclipse.glsp.server.types.ElementAndBounds;

import com.borkdominik.big.glsp.server.core.handler.operation.change_bounds.BGEMFChangeBoundsOperationHandler;

public class UMLChangeBoundsOperationHandler extends BGEMFChangeBoundsOperationHandler {
    @Override
    public Optional<Command> createCommand(final ChangeBoundsOperation operation) {
        var editingDomain = modelState.getEditingDomain();

        var compoundCommand = new CompoundCommand();
        for (var element : operation.getNewBounds()) {
            modelState.getIndex().getNotation(element.getElementId(), Shape.class)
                    .map(shape -> updateShape(editingDomain, shape, element))
                    .ifPresent(commands -> commands.forEach(compoundCommand::append));
        }

        return compoundCommand.getCommandList().isEmpty() ? Optional.empty() : Optional.of(compoundCommand);
    }

    private List<Command> updateShape(final EditingDomain editingDomain, final Shape shape,
            final ElementAndBounds elementAndBounds) {
        var commands = new ArrayList<Command>();
        var element = this.modelState.getElementIndex().getGModelOrThrow(shape.getSemanticElement().getElementId());
        if (elementAndBounds.getNewPosition() != null) {
            var position = EcoreUtil.copy(elementAndBounds.getNewPosition());
            var newPosition = GraphUtil.point(position.getX(), position.getY());

            if (!(element.getParent() instanceof GGraph)) {
                newPosition = GraphUtil.point(Math.max(position.getX(), 0), Math.max(position.getY(), 0));
            }

            Command setPosCommand = SetCommand.create(editingDomain, shape,
                    NotationPackage.Literals.SHAPE__POSITION, newPosition);
            commands.add(setPosCommand);
        }

        if (elementAndBounds.getNewSize() != null) {
            var setSizeCommand = SetCommand.create(editingDomain, shape,
                    NotationPackage.Literals.SHAPE__SIZE, EcoreUtil.copy(elementAndBounds.getNewSize()));
            commands.add(setSizeCommand);
        }
        return commands;
    }
}
