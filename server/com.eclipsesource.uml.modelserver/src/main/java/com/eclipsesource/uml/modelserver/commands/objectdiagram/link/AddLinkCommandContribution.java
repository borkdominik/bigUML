package com.eclipsesource.uml.modelserver.commands.objectdiagram.link;

public class AddLinkCommandContribution { /*-{

    public static final String TYPE = "addLinkContributuion";
    public static final String SOURCE_CLASS_URI_FRAGMENT = "sourceClassUriFragment";
    public static final String TARGET_CLASS_URI_FRAGMENT = "targetClassUriFragment";

    public static CCompoundCommand create(final String sourceClassUriFragment, final String targetClassUriFragment) {
        CCompoundCommand addLinkCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addLinkCommand.setType(TYPE);
        addLinkCommand.getProperties().put(SOURCE_CLASS_URI_FRAGMENT, sourceClassUriFragment);
        addLinkCommand.getProperties().put(TARGET_CLASS_URI_FRAGMENT, targetClassUriFragment);
        return addLinkCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String sourceClassUriFragment = command.getProperties().get(SOURCE_CLASS_URI_FRAGMENT);
        String targetClassUriFragment = command.getProperties().get(TARGET_CLASS_URI_FRAGMENT);

        return new AddLinkCompoundCommand(domain, modelUri, sourceClassUriFragment, targetClassUriFragment);
    }   */
}
