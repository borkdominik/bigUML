package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.actor;

public class RemoveActorCommandContribution { /*-{

    public static final String TYPE = "removeActor";

    public static CCompoundCommand create(final String semanticUri) {
        CCompoundCommand removeActorCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeActorCommand.setType(TYPE);
        removeActorCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        return removeActorCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
        throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveActorCompoundCommand(domain, modelUri,semanticUriFragment);
    }   */
}
