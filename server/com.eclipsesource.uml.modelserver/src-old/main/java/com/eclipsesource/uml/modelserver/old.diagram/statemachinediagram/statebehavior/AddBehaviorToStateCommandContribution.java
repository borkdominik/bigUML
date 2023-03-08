package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.statebehavior;

public class AddBehaviorToStateCommandContribution { /*-{

    public static final String TYPE = "addBehaviorToState";
    public static final String ACTIVITY_TYPE = "activityType";

    public static CCommand create(final String parentSemanticUri, final String activityType) {
        CCommand addBehaviorToStateCommand = CCommandFactory.eINSTANCE.createCommand();
        addBehaviorToStateCommand.setType(TYPE);
        addBehaviorToStateCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
        addBehaviorToStateCommand.getProperties().put(ACTIVITY_TYPE, activityType);
        return addBehaviorToStateCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String parentSemanticUriFragment = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
        String activityType = command.getProperties().get(ACTIVITY_TYPE);

        return new AddBehaviorToStateCommand(domain, modelUri, parentSemanticUriFragment, activityType);
    }
   */
}
