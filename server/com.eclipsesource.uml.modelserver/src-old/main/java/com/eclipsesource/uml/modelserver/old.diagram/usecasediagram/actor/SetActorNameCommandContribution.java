package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.actor;

public class SetActorNameCommandContribution { /*-{

    public static final String TYPE = "setActorName";
    public static final String NEW_NAME = "newName";

    public static CCommand create(final String semanticUri, final String newName) {
        CCommand setActorNameCommand = CCommandFactory.eINSTANCE.createCommand();
        setActorNameCommand.setType(TYPE);
        setActorNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        setActorNameCommand.getProperties().put(NEW_NAME, newName);
        return setActorNameCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
        throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        String newName = command.getProperties().get(NEW_NAME);

        return new SetNameCommand(domain, modelUri, semanticUriFragment, newName);
    }   */
}
