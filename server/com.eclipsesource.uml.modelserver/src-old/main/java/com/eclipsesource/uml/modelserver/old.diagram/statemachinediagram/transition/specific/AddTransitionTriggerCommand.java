package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.transition.specific;

public class AddTransitionTriggerCommand { /*- {

    protected String semanticUriFragment;
    protected String newValue;

    public AddTransitionTriggerCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                       final String newValue) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.newValue = newValue;
    }

    @Override
    protected void doExecute() {
        Transition transition = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Transition.class);
        // TODO: ALLOW MULTIPLE TRIGGERS
        if (transition.getTriggers().size() != 0 && !newValue.isEmpty()) {
            transition.getTriggers().get(0).setName(newValue);
        } else if (transition.getTriggers().size() != 0 && newValue.isEmpty()) {
            transition.getTriggers().remove(0);
        } else if (!newValue.isEmpty()) {
            transition.createTrigger(newValue).setName(newValue);
        }
    }   */
}
