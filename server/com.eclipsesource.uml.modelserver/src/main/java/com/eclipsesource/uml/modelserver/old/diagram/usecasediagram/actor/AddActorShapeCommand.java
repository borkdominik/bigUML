package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.actor;

public class AddActorShapeCommand { /*- {

    protected final GPoint shapePosition;
    protected String semanticProxyUri;
    protected Supplier<Actor> actorSupplier;

    private AddActorShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);
        this.shapePosition = position;
        this.actorSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddActorShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddActorShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final Supplier<Actor> classSupplier) {
        this(domain, modelUri, position);
        this.actorSupplier = classSupplier;
    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);

        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(actorSupplier.get()));
        }
        newShape.setSemanticElement(proxy);

        umlDiagram.getElements().add(newShape);
    }   */
}
