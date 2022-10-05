package com.eclipsesource.uml.modelserver.commands.usecasediagram.extensionpoint;

public class RemoveExtensionPointCommandContribution { /*-{

    public static final String TYPE = "removeExtensionPoint";

    public static CCompoundCommand create(final String semanticUriFragment) {
        CCompoundCommand removeExtensionPointCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeExtensionPointCommand.setType(TYPE);
        removeExtensionPointCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUriFragment);
        return removeExtensionPointCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveExtensionPointCompoundCommand(domain, modelUri, semanticUriFragment);
    }   */
}
