package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.extendedge;

public class AddExtendEdgeCommand { /*- {

    protected String semanticProxyUri;
    protected Supplier<Extend> extendSupplier;

    private AddExtendEdgeCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.semanticProxyUri = null;
        this.extendSupplier = null;
    }

    public AddExtendEdgeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
        this(domain, modelUri);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddExtendEdgeCommand(final EditingDomain domain, final URI modelUri,
        final Supplier<Extend> extendSupplier) {
        this(domain, modelUri);
        this.extendSupplier = extendSupplier;
    }

    @Override
    protected void doExecute() {
        Edge newEdge = UnotationFactory.eINSTANCE.createEdge();

        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(extendSupplier.get()));
        }
        newEdge.setSemanticElement(proxy);
        umlDiagram.getElements().add(newEdge);
    }   */
}
