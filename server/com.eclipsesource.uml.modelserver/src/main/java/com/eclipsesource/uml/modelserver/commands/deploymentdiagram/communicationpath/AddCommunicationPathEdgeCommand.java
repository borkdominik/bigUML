package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath;

public class AddCommunicationPathEdgeCommand { /*- {

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
   */
}
