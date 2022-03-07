package com.eclipsesource.uml.modelserver.commands.objectdiagram.object;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.NamedElement;

import java.util.function.Supplier;

public class AddObjectCompoundCommand extends CompoundCommand {

    public AddObjectCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint objectPosition) {
        AddObjectCommand command = new AddObjectCommand(domain, modelUri);
        this.append(command);
        //Supplier<InstanceSpecification> semanticResultSupplier = command::getNewObject;
        //Supplier<Class> semanticResultSupplier = command::getNewObject;
        Supplier<NamedElement> semanticResultSupplier = command::getNewObject;
        this.append(new AddObjectShapeCommand(domain, modelUri, objectPosition, semanticResultSupplier));
    }
}
