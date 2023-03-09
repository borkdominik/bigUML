package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.deploymentedge;

public class AddDeploymentEdgeCommand { /*- {

    protected String semanticProxyUri;
    protected Supplier<Deployment> deploymentSupplier;

    private AddDeploymentEdgeCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.semanticProxyUri = null;
        this.deploymentSupplier = null;
    }

    public AddDeploymentEdgeCommand(final EditingDomain domain, final URI modelUri,
        final String semanticProxyUri) {
        this(domain, modelUri);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddDeploymentEdgeCommand(final EditingDomain domain, final URI modelUri,
        final Supplier<Deployment> deploymentSupplier) {
        this(domain, modelUri);
        this.deploymentSupplier = deploymentSupplier;
    }

    @Override
    protected void doExecute() {
        Edge newEdge = UnotationFactory.eINSTANCE.createEdge();
        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(deploymentSupplier.get()));
        }
        newEdge.setSemanticElement(proxy);
        umlDiagram.getElements().add(newEdge);
    }
       */
}
