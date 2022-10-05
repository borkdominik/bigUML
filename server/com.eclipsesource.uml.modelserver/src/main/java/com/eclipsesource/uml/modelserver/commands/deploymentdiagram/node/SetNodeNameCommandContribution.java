package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.node;

public class SetNodeNameCommandContribution { /*-{

    public static final String TYPE = "setNodeName";
    public static final String NEW_NAME = "newName";

    public static CCommand create(final String semanticUri, final String newName) {
        CCommand setNodeNameCommand = CCommandFactory.eINSTANCE.createCommand();
        setNodeNameCommand.setType(TYPE);
        setNodeNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        setNodeNameCommand.getProperties().put(NEW_NAME, newName);
        return setNodeNameCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        String newName = command.getProperties().get(NEW_NAME);

        return new SetNameCommand(domain, modelUri, semanticUriFragment, newName);
    }   */
}
