package com.eclipsesource.uml.modelserver.commands.usecasediagram.includeedge;

public class AddIncludeEdgeCommand { /*- {

    protected String semanticProxyUri;
    protected Supplier<Include> includeSupplier;

    private AddIncludeEdgeCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.semanticProxyUri = null;
        this.includeSupplier = null;
    }

    public AddIncludeEdgeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
        this(domain, modelUri);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddIncludeEdgeCommand(final EditingDomain domain, final URI modelUri,
        final Supplier<Include> includeSupplier) {
        this(domain, modelUri);
        this.includeSupplier = includeSupplier;
    }

    @Override
    protected void doExecute() {
        Edge newEdge = UnotationFactory.eINSTANCE.createEdge();

        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();

        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(includeSupplier.get()));
        }
        newEdge.setSemanticElement(proxy);
        umlDiagram.getElements().add(newEdge);
    }   */
}
