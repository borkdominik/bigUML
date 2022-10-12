package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.transition.specific;

public class AddTransitionEffectCommand { /*- {

    protected String semanticUriFragment;
    protected String newValue;
    protected final EClass eClass;

    public AddTransitionEffectCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                      final String newValue) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.newValue = newValue;
        this.eClass = UMLFactory.eINSTANCE.createActivity().eClass();
    }

    @Override
    protected void doExecute() {
        Transition transition = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Transition.class);
        if (transition.getEffect() != null && !newValue.isEmpty()) {
            transition.getEffect().setName(newValue);
        } else if (transition.getEffect() != null && newValue.isEmpty()) {
            transition.getEffect().destroy();
        } else if (!newValue.isEmpty()) {
            transition.createEffect(newValue, eClass);
            transition.getEffect().setName("new effect");
        }
    }   */
}
