package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.UseCase;

import java.util.function.Supplier;

public class AddUseCaseCompoundCommand extends CompoundCommand {

    public AddUseCaseCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {


        AddUseCaseCommand command = new AddUseCaseCommand(domain, modelUri);
        this.append(command);
        Supplier<UseCase> semanticResultSupplier = command::getNewUseCase;
        this.append(new AddUseCaseShapeCommand(domain, modelUri, position, semanticResultSupplier));
    }

    public AddUseCaseCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                     final String parentSemanticUri) {

        AddUseCaseCommand command = new AddUseCaseCommand(domain, modelUri, parentSemanticUri);
        this.append(command);
        Supplier<UseCase> semanticResultSupplier = command::getNewUseCase;
        this.append(new AddUseCaseShapeCommand(domain, modelUri, position, semanticResultSupplier));
    }

}
