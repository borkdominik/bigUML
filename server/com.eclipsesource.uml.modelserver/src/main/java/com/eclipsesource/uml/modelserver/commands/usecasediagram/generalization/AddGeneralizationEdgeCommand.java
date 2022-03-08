package com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Generalization;

import java.util.function.Supplier;

public class AddGeneralizationEdgeCommand extends UmlNotationElementCommand {

    protected String semanticProxyUri;
    protected Supplier<Generalization> generalizationSupplier;

    private AddGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.generalizationSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
        this(domain, modelUri);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri,
                                        final Supplier<Generalization> generalizationSupplier) {
        this(domain, modelUri);
        this.generalizationSupplier = generalizationSupplier;
    }

    @Override
    protected void doExecute() {
        Edge newEdge = UnotationFactory.eINSTANCE.createEdge();
        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            //TODO: Check if this is actually working
            //proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(generalizationSupplier.get()));
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(generalizationSupplier.get()));
        }
        newEdge.setSemanticElement(proxy);
        umlDiagram.getElements().add(newEdge);
    }
}
