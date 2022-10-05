package com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior;

public class RemoveBehaviorFromStateCommand { /*- {

    protected final String parentSemanticUriFragment;
    protected final String semanticUriFragment;

    public RemoveBehaviorFromStateCommand(final EditingDomain domain, final URI modelUri,
                                          final String parentSemanticUriFragment,
                                          final String semanticUriFragment) {
        super(domain, modelUri);
        this.parentSemanticUriFragment = parentSemanticUriFragment;
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        State parentState = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, State.class);
        Behavior behaviorToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Behavior.class);
        if (behaviorToRemove != null) {
            if (behaviorToRemove.equals(parentState.getEntry())) {
                parentState.setEntry(null);
            } else if (behaviorToRemove.equals(parentState.getDoActivity())) {
                parentState.setDoActivity(null);
            } else if (behaviorToRemove.equals(parentState.getExit())) {
                parentState.setExit(null);
            }
        }
    }
   */
}
