package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.transition;

public class RemoveTransitionCommandContribution { /*-{

    public static final String TYPE = "removeTransition";

    public static CCommand create(final String parentSemanticUri, final String semanticUri) {
        CCommand removeTransitionCommand = CCommandFactory.eINSTANCE.createCommand();
        removeTransitionCommand.setType(TYPE);
        removeTransitionCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
        removeTransitionCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);

        return removeTransitionCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        String parentSemanticUri = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
        String semanticUri = command.getProperties().get(SEMANTIC_URI_FRAGMENT);

        return new RemoveTransitionCompoundCommand(domain, modelUri, parentSemanticUri, semanticUri);
    }   */
}
