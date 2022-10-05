package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath;

public class SetCommunicationPathEndNameCommandContribution { /*-{

    public static final String TYPE = "setCommunicationPathEndName";
    public static final String NEW_NAME = "newName";

    public static CCommand create(final String semanticUri, final String newName) {
        CCommand setCommunicationPathEndNameCommand = CCommandFactory.eINSTANCE.createCommand();
        setCommunicationPathEndNameCommand.setType(TYPE);
        setCommunicationPathEndNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        setCommunicationPathEndNameCommand.getProperties().put(NEW_NAME, newName);
        return setCommunicationPathEndNameCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        String newName = command.getProperties().get(NEW_NAME);

        return new SetNameCommand(domain, modelUri, semanticUriFragment, newName);
    }
       */
}
