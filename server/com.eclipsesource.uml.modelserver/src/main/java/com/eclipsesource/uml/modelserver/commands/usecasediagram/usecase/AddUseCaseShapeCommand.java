package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase;

public class AddUseCaseShapeCommand { /*- {

    protected final GPoint shapePosition;
    protected String semanticProxyUri;
    protected Supplier<UseCase> useCaseSupplier;

    private AddUseCaseShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);
        this.shapePosition = position;
        this.useCaseSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddUseCaseShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddUseCaseShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final Supplier<UseCase> supplier) {
        this(domain, modelUri, position);
        this.useCaseSupplier = supplier;
    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);

        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(useCaseSupplier.get()));
        }
        newShape.setSemanticElement(proxy);

        umlDiagram.getElements().add(newShape);
    }   */
}
