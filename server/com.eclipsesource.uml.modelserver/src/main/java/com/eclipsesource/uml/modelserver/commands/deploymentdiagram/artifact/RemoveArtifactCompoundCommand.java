package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.artifact;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveArtifactCompoundCommand extends CompoundCommand {

    public RemoveArtifactCompoundCommand(final EditingDomain domain, final URI modelUri,
                                         final String semanticUriFragment, final String parentSemanticUri) {
        this.append(new RemoveArtifactCommand(domain, modelUri, semanticUriFragment, parentSemanticUri));
        this.append(new RemoveArtifactShapeCommand(domain, modelUri, semanticUriFragment));
    }
}
