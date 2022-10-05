package com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior;

public class AddBehaviorToStateCommand { /*- {

    protected final String parentSemanticUriFragment;
    protected final String activityType;
    protected final EClass eClass;

    public AddBehaviorToStateCommand(final EditingDomain domain, final URI modelUri,
                                     final String parentSemanticUriFragment, final String activityType) {
        super(domain, modelUri);
        this.parentSemanticUriFragment = parentSemanticUriFragment;
        this.activityType = activityType;
        this.eClass = UMLFactory.eINSTANCE.createActivity().eClass();
    }

    @Override
    protected void doExecute() {
        State parentState = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, State.class);
        switch (activityType) {
            case "node:state-entry-activity":
                parentState.setEntry(parentState.createEntry("entryActivity", eClass));
                break;

            case "node:state-do-activity":
                parentState.setDoActivity(parentState.createDoActivity("doActivity", eClass));
                break;

            case "node:state-exit-activity":
                parentState.setExit(parentState.createExit("exitActivity", eClass));
                break;
        }
    }
   */
}
