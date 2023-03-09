package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.transition;

public class AddTransitionEdgeCommand { /*- {

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
    }   */
}
