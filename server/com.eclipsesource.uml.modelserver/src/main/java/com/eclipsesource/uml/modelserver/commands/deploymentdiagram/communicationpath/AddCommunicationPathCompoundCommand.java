package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath;

import java.util.function.Supplier;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.CommunicationPath;

public class AddCommunicationPathCompoundCommand extends CompoundCommand {

    public AddCommunicationPathCompoundCommand(final EditingDomain domain, final URI modelUri,
                                               final String sourceNodeUriFragment, final String targetNodeUriFragment) {
        AddCommunicationPathCommand command = new AddCommunicationPathCommand(domain, modelUri, sourceNodeUriFragment,
                targetNodeUriFragment);
        this.append(command);
        Supplier<CommunicationPath> semanticResultSupplier = command::getNewCommunicationPath;
        this.append(new AddCommunicationPathEdgeCommand(domain, modelUri, semanticResultSupplier));
    }
}
