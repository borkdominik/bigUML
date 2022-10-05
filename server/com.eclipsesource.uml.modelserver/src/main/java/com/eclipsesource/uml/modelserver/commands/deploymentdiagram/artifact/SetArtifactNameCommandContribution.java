package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.artifact;

public class SetArtifactNameCommandContribution { /*-{

    public static final String TYPE = "setArtifactName";
    public static final String NEW_NAME = "newName";

    public static CCommand create(final String semanticUri, final String newName) {
        CCommand setArtifactNameCommand = CCommandFactory.eINSTANCE.createCommand();
        setArtifactNameCommand.setType(TYPE);
        setArtifactNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        setArtifactNameCommand.getProperties().put(NEW_NAME, newName);
        return setArtifactNameCommand;
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
