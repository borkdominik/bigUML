package com.eclipsesource.uml.modelserver.old.diagram.objectdiagram.link;

public class AddLinkEdgeCommand { /*- {

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
    }   */
}
