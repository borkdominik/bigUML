package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.finalstate;

public class RemoveFinalStateCommandContribution { /*-{

    public static final String TYPE = "removeFinalState";

    public static CCompoundCommand create(final String parentSemanticUri, final String semanticUri) {
        CCompoundCommand removeFinalStateCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeFinalStateCommand.setType(TYPE);
        removeFinalStateCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
        removeFinalStateCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);

        return removeFinalStateCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        String parentSemanticUri = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);

        return new RemoveFinalStateCompoundCommand(domain, modelUri, parentSemanticUri, semanticUriFragment);
    }   */
}
