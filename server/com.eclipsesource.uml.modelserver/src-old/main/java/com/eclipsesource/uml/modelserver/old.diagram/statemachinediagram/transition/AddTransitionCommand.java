package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.transition;

public class AddTransitionCommand { /*- {

    private final Transition transition;
    protected final Vertex source;
    protected final Vertex target;
    protected final Region containerRegion;

    public AddTransitionCommand(final EditingDomain domain, final URI modelUri,
                                final String containerRegionUriFragment, final String sourceClassUriFragment,
                                final String targetClassUriFragment) {
        super(domain, modelUri);
        transition = UMLFactory.eINSTANCE.createTransition();
        source = UmlSemanticCommandUtil.getElement(umlModel, sourceClassUriFragment, Vertex.class);
        target = UmlSemanticCommandUtil.getElement(umlModel, targetClassUriFragment, Vertex.class);
        containerRegion = UmlSemanticCommandUtil.getElement(umlModel, containerRegionUriFragment, Region.class);
    }

    @Override
    protected void doExecute() {
        transition.setSource(source);
        transition.setTarget(target);
        transition.setKind(TransitionKind.EXTERNAL_LITERAL);
        containerRegion.getTransitions().add(transition);
    }

    public Transition getNewTransition() {
        return transition;
    }   */
}
