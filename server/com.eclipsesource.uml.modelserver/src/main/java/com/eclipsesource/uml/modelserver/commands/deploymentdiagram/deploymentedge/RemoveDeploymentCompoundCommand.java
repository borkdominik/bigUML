package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentedge;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveDeploymentCompoundCommand extends CompoundCommand {

    public RemoveDeploymentCompoundCommand(final EditingDomain domain, final URI modelUri,
                                           final String semanticUriFragment, final String parentUriFragment) {
        this.append(new RemoveDeploymentCommand(domain, modelUri, semanticUriFragment, parentUriFragment));
        this.append(new RemoveDeploymentEdgeCommand(domain, modelUri, semanticUriFragment));

    }

}
