package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.artifact;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Artifact;

import java.util.function.Supplier;

public class AddArtifactCompoundCommand extends CompoundCommand {

    public AddArtifactCompoundCommand(final EditingDomain domain, final URI modelUri,
                                      final GPoint artifactPosition, final String parentSemanticUri) {

        AddArtifactCommand command = new AddArtifactCommand(domain, modelUri, parentSemanticUri);
        this.append(command);
        Supplier<Artifact> semanticResultSupplier = command::getNewArtifact;
        this.append(new AddArtifactShapeCommand(domain, modelUri, artifactPosition, semanticResultSupplier));
    }
}
