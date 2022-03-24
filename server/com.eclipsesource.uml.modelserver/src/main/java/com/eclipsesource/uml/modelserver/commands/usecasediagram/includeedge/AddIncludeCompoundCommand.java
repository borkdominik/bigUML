package com.eclipsesource.uml.modelserver.commands.usecasediagram.includeedge;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Include;

import java.util.function.Supplier;

public class AddIncludeCompoundCommand extends CompoundCommand {

    public AddIncludeCompoundCommand(final EditingDomain domain, final URI modelUri,
                                     final String sourceUseCaseUriFragment, final String targetUseCaseUriFragment) {

        AddIncludeCommand command = new AddIncludeCommand(domain, modelUri,
                sourceUseCaseUriFragment, targetUseCaseUriFragment);
        this.append(command);
        Supplier<Include> semanticResultSupplier = command::getNewInclude;
        this.append(new AddIncludeEdgeCommand(domain, modelUri, semanticResultSupplier));
    }


}
