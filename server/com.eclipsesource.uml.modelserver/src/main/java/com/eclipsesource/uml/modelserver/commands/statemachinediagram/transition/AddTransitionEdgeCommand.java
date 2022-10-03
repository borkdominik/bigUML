package com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import org.eclipse.glsp.server.emf.model.notation.Edge;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Transition;

import java.util.function.Supplier;

public class AddTransitionEdgeCommand extends UmlNotationElementCommand {

    protected String semanticProxyUri;
    protected Supplier<Transition> transitionSupplier;

    private AddTransitionEdgeCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.semanticProxyUri = null;
        this.transitionSupplier = null;
    }

    public AddTransitionEdgeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
        this(domain, modelUri);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddTransitionEdgeCommand(final EditingDomain domain, final URI modelUri,
        final Supplier<Transition> transitionSupplier) {
        this(domain, modelUri);
        this.transitionSupplier = transitionSupplier;
    }

    @Override
    protected void doExecute() {
        Edge newEdge = UnotationFactory.eINSTANCE.createEdge();
        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            String uri = EcoreUtil.getURI(transitionSupplier.get()).fragment();
            proxy.setUri(uri);
        }
        newEdge.setSemanticElement(proxy);
        umlDiagram.getElements().add(newEdge);
    }
}
