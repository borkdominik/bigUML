package com.eclipsesource.uml.modelserver.commands.usecasediagram.component;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Component;

import java.util.function.Supplier;

public class AddComponentCompoundCommand extends CompoundCommand {

    public AddComponentCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint componentPosition) {

        AddComponentCommand command = new AddComponentCommand(domain, modelUri);
        this.append(command);
        Supplier<Component> semanticResultSupplier = command::getNewComponent;
        this.append(new AddComponentShapeCommand(domain, modelUri, componentPosition, semanticResultSupplier));
    }

    public AddComponentCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint componentPosition,
                                       final String parentUri) {
        AddComponentCommand command = new AddComponentCommand(domain, modelUri, parentUri);
        this.append(command);
        Supplier<Component> semanticResultSupplier = command::getNewComponent;
        this.append(new AddComponentShapeCommand(domain, modelUri, componentPosition, semanticResultSupplier));
    }
}
