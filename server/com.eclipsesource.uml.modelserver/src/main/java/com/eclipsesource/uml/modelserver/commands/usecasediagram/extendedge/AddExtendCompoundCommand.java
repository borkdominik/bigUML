package com.eclipsesource.uml.modelserver.commands.usecasediagram.extendedge;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Extend;

import java.util.function.Supplier;

public class AddExtendCompoundCommand  extends CompoundCommand {

    public AddExtendCompoundCommand(final EditingDomain domain, final URI modelUri, final String extendingUseCaseUri,
                                    final String extendedUseCaseUri) {
        AddExtendCommand command = new AddExtendCommand(domain, modelUri, extendingUseCaseUri, extendedUseCaseUri);
        this.append(command);
        Supplier<Extend> semanticResultSupplier = command::getNewExtend;
        this.append(new AddExtendEdgeCommand(domain, modelUri, semanticResultSupplier));
    }
}
