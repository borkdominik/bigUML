package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.deploymentspecification;

public class AddDeploymentSpecificationShapeCommand { /*- {

    protected Supplier<DeploymentSpecification> deploymentSpecificationSupplier;
    protected final GPoint shapePosition;
    protected String semanticProxyUri;

    private AddDeploymentSpecificationShapeCommand(final EditingDomain domain, final URI modelUri,
        final GPoint position) {
        super(domain, modelUri);
        this.shapePosition = position;
        this.deploymentSpecificationSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddDeploymentSpecificationShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddDeploymentSpecificationShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final Supplier<DeploymentSpecification> deploymentSpecificationSupplier) {
        this(domain, modelUri, position);
        this.deploymentSpecificationSupplier = deploymentSpecificationSupplier;

    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);
        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(deploymentSpecificationSupplier.get()));
        }
        newShape.setSemanticElement(proxy);
        umlDiagram.getElements().add(newShape);
    }
   */
}
