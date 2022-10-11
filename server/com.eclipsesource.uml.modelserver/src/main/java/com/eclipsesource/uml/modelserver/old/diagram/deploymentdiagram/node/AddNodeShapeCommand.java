package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.node;

public class AddNodeShapeCommand { /*- {

    protected Supplier<Node> nodeSupplier;
    protected final GPoint shapePosition;
    protected String semanticProxyUri;

    private AddNodeShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);
        this.shapePosition = position;
        this.nodeSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddNodeShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddNodeShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final Supplier<Node> nodeSupplier) {
        this(domain, modelUri, position);
        this.nodeSupplier = nodeSupplier;

    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);
        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(nodeSupplier.get()));
        }
        newShape.setSemanticElement(proxy);

        umlDiagram.getElements().add(newShape);
    }   */
}
