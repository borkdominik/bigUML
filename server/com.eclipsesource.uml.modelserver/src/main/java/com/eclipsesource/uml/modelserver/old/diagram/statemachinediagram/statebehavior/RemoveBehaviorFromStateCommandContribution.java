package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.statebehavior;

public class RemoveBehaviorFromStateCommandContribution { /*-{

    public static final String TYPE = "removeBehaviorFromState";

    public static CCommand create(final String parentSemanticUri, final String semanticUri) {
        CCommand removePropertyCommand = CCommandFactory.eINSTANCE.createCommand();
        removePropertyCommand.setType(TYPE);
        removePropertyCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
        removePropertyCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        return removePropertyCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        String parentSemanticUri = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
        String semanticUri = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveBehaviorFromStateCommand(domain, modelUri, parentSemanticUri, semanticUri);
    }
   */
}
