package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import org.eclipse.glsp.server.emf.model.notation.Edge;

public class RemoveCommunicationPathEdgeCommand extends UmlNotationElementCommand {

    protected final Edge edgeToRemove;

    public RemoveCommunicationPathEdgeCommand(final EditingDomain domain, final URI modelUri,
        final String semanticProxyUri) {
        super(domain, modelUri);
        this.edgeToRemove = UmlNotationCommandUtil.getNotationElement(modelUri, domain, semanticProxyUri, Edge.class);
    }

    @Override
    protected void doExecute() {
        umlDiagram.getElements().remove(edgeToRemove);
    }
}
