package com.eclipsesource.uml.modelserver.commands.usecasediagram.actor;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Actor;

import java.util.function.Supplier;

public class AddActorCompoundCommand extends CompoundCommand {

    public AddActorCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        AddActorCommand command = new AddActorCommand(domain, modelUri);
        this.append(command);
        Supplier<Actor> semanticResultsSupplier = command::getNewActor;
        this.append(new AddActorShapeCommand(domain, modelUri, position, semanticResultsSupplier));
    }

    public AddActorCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                   final String parentSemanticUri) {
        AddActorCommand command = new AddActorCommand(domain, modelUri, parentSemanticUri);
        this.append(command);
        Supplier<Actor> semanticResultsSupplier = command::getNewActor;
        this.append(new AddActorShapeCommand(domain, modelUri, position, semanticResultsSupplier));
    }

}
