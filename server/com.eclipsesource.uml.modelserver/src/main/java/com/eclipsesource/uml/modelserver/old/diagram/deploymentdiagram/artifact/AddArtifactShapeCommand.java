package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.artifact;

public class AddArtifactShapeCommand { /*- {

    protected final GPoint shapePosition;
    protected String semanticProxyUri;
    protected Supplier<Artifact> artifactSupplier;

    private AddArtifactShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);
        this.shapePosition = position;
        this.artifactSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddArtifactShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddArtifactShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final Supplier<Artifact> artifactSupplier) {
        this(domain, modelUri, position);
        this.artifactSupplier = artifactSupplier;

    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);
        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();

        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(artifactSupplier.get()));
        }

        newShape.setSemanticElement(proxy);
        umlDiagram.getElements().add(newShape);
    }
       */
}
