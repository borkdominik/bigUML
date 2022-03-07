package com.eclipsesource.uml.modelserver.commands.objectdiagram.link;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Association;

import java.util.function.Supplier;

public class AddLinkEdgeCommand extends UmlNotationElementCommand {

    protected String semanticProxyUri;
    protected Supplier<Association> linkSupplier;

    private AddLinkEdgeCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.semanticProxyUri = null;
        this.linkSupplier = null;
    }

    public AddLinkEdgeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
        this(domain, modelUri);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddLinkEdgeCommand(final EditingDomain domain, final URI modelUri,
                                     final Supplier<Association> associationSupplier) {
        this(domain, modelUri);
        this.linkSupplier = associationSupplier;
    }

    @Override
    protected void doExecute() {
        Edge newEdge = UnotationFactory.eINSTANCE.createEdge();

        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(linkSupplier.get()));
        }
        newEdge.setSemanticElement(proxy);

        umlDiagram.getElements().add(newEdge);
    }
}
