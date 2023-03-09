package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.communicationpath;

public class RemoveCommunicationPathCommandContribution { /*-{

    public static final String TYPE = "removeCommunicationPath";

    public static CCompoundCommand create(final String semanticUriFragment) {
        CCompoundCommand removeCommunicationPathCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeCommunicationPathCommand.setType(TYPE);
        removeCommunicationPathCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUriFragment);
        return removeCommunicationPathCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveCommunicationPathCompoundCommand(domain, modelUri, semanticUriFragment);
    }
       */
}
