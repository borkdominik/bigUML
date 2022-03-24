package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Package;

import java.util.function.Supplier;

public class AddPackageCompoundCommand extends CompoundCommand {

    public AddPackageCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        AddPackageCommand command = new AddPackageCommand(domain, modelUri);
        this.append(command);
        Supplier<Package> semanticResultSupplier = command::getNewPackage;
        this.append(new AddPackageShapeCommand(domain, modelUri, position, semanticResultSupplier));
    }
}
