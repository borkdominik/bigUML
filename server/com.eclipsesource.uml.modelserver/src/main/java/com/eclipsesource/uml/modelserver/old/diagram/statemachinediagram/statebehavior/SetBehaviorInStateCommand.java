package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.statebehavior;

public class SetBehaviorInStateCommand { /*- {

    protected String semanticUriFragment;
    protected String behaviorType;
    protected String newName;

    public SetBehaviorInStateCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                     final String behaviorType, final String newName) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.behaviorType = behaviorType;
        this.newName = newName;
    }

    @Override
    protected void doExecute() {
        Behavior behavior = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Behavior.class);
        State container = (State) behavior.eContainer();

        switch (behaviorType) {
            case "node:state-entry-activity":
                behavior.setName(newName);
                container.setEntry(behavior);
                break;
            case "node:state-do-activity":
                behavior.setName(newName);
                container.setDoActivity(behavior);
                break;
            case "node:state-exit-activity":
                behavior.setName(newName);
                container.setExit(behavior);
                break;
        }
    }   */
}
