package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath;

import java.util.function.Supplier;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.CommunicationPath;

import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;

public class AddCommunicationPathEdgeCommand extends UmlNotationElementCommand {

    protected String semanticProxyUri;
    protected Supplier<CommunicationPath> communicationPathSupplier;

    private AddCommunicationPathEdgeCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.semanticProxyUri = null;
        this.communicationPathSupplier = null;
    }

    public AddCommunicationPathEdgeCommand(final EditingDomain domain, final URI modelUri,
                                           final String semanticProxyUri) {
        this(domain, modelUri);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddCommunicationPathEdgeCommand(final EditingDomain domain, final URI modelUri,
                                           final Supplier<CommunicationPath> communicationPathSupplier) {
        this(domain, modelUri);
        this.communicationPathSupplier = communicationPathSupplier;
    }

    @Override
    protected void doExecute() {
        Edge newEdge = UnotationFactory.eINSTANCE.createEdge();
        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(communicationPathSupplier.get()));
        }
        newEdge.setSemanticElement(proxy);
        umlDiagram.getElements().add(newEdge);
    }

}
