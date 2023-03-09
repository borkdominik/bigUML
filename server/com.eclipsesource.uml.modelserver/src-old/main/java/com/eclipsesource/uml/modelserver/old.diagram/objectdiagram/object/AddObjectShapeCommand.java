package com.eclipsesource.uml.modelserver.old.diagram.objectdiagram.object;

public class AddObjectShapeCommand { /*- {

    protected final GPoint shapePosition;
    protected String semanticProxyUri;
    // protected Supplier<InstanceSpecification> objectSupplier;
    // protected Supplier<Class> objectSupplier;
    protected Supplier<NamedElement> objectSupplier;

    private AddObjectShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);
        this.shapePosition = position;
        this.objectSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddObjectShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final Supplier<NamedElement> objectSupplier) {
        this(domain, modelUri, position);
        this.objectSupplier = objectSupplier;
    }

    public AddObjectShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);

        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(objectSupplier.get()));
        }
        newShape.setSemanticElement(proxy);
        umlDiagram.getElements().add(newShape);
    }   */
}
