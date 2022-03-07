package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentedge;

import java.util.function.Supplier;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Deployment;

public class AddDeploymentCompoundCommand extends CompoundCommand {

    public AddDeploymentCompoundCommand(final EditingDomain domain, final URI modelUri,
                                        final String sourceNodeUriFragment, final String targetNodeUriFragment) {
        AddDeploymentCommand command = new AddDeploymentCommand(domain, modelUri, sourceNodeUriFragment,
                targetNodeUriFragment);
        this.append(command);
        Supplier<Deployment> semanticResultSupplier = command::getNewDeployment;
        this.append(new AddDeploymentEdgeCommand(domain, modelUri, semanticResultSupplier));
    }

}
