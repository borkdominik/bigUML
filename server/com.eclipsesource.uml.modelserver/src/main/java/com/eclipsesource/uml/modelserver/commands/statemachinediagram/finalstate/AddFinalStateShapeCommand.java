package com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate;

public class AddFinalStateShapeCommand { /*- {

    protected final GPoint shapePosition;
    protected String semanticProxyUri;
    protected Supplier<FinalState> finalStateSupplier;

    private AddFinalStateShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);

        this.shapePosition = position;
        this.finalStateSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddFinalStateShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddFinalStateShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final Supplier<FinalState> stateSupplier) {

        this(domain, modelUri, position);
        this.finalStateSupplier = stateSupplier;
    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(shapePosition);

        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (semanticProxyUri != null) {
            proxy.setUri(semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(finalStateSupplier.get()));
        }
        newShape.setSemanticElement(proxy);
        umlDiagram.getElements().add(newShape);
    }   */
}
