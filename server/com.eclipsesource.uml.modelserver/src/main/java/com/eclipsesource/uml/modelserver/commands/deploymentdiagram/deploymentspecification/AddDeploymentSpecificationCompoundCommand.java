package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentspecification;

import java.util.function.Supplier;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.DeploymentSpecification;

public class AddDeploymentSpecificationCompoundCommand extends CompoundCommand {

    public AddDeploymentSpecificationCompoundCommand(final EditingDomain domain, final URI modelUri,
                                                     final GPoint deploymentSpecificationPosition, final String parentSemanticUri) {

        AddDeploymentSpecificationCommand command = new AddDeploymentSpecificationCommand(domain, modelUri,
                parentSemanticUri);
        this.append(command);
        Supplier<DeploymentSpecification> semanticResultSupplier = command::getNewDeploymentSpecification;
        this.append(new AddDeploymentSpecificationShapeCommand(domain, modelUri, deploymentSpecificationPosition,
                semanticResultSupplier));
    }
}
