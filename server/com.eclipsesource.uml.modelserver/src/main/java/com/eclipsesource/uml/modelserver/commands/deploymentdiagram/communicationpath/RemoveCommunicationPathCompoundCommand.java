package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveCommunicationPathCompoundCommand extends CompoundCommand {

    public RemoveCommunicationPathCompoundCommand(final EditingDomain domain, final URI modelUri,
                                                  final String semanticUriFragment) {
        this.append(new RemoveCommunicationPathCommand(domain, modelUri, semanticUriFragment));
        this.append(new RemoveCommunicationPathEdgeCommand(domain, modelUri, semanticUriFragment));
    }
}
