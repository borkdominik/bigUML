package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.executionenvironment;

public class SetExecutionEnvironmentNameCommandContribution { /*-{

    public static final String TYPE = "setExecutionEnvironmentName";
    public static final String NEW_NAME = "newName";

    public static CCommand create(final String semanticUri, final String newName) {
        CCommand setExecutionEnvironmentNameCommand = CCommandFactory.eINSTANCE.createCommand();
        setExecutionEnvironmentNameCommand.setType(TYPE);
        setExecutionEnvironmentNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        setExecutionEnvironmentNameCommand.getProperties().put(NEW_NAME, newName);
        return setExecutionEnvironmentNameCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        String newName = command.getProperties().get(NEW_NAME);

        return new SetNameCommand(domain, modelUri, semanticUriFragment, newName);
    }   */
}
