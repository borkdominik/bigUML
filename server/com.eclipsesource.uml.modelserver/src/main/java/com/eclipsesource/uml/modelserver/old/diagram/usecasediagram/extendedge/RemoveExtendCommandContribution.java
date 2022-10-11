package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.extendedge;

public class RemoveExtendCommandContribution { /*-{

    public static final String TYPE = "removeExtend";

    public static CCompoundCommand create(final String semanticUriFragment) {
        CCompoundCommand removeExtendCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeExtendCommand.setType(TYPE);
        removeExtendCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUriFragment);
        return removeExtendCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
        throws DecodingException {
        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveExtendCompoundCommand(domain, modelUri, semanticUriFragment);
    }   */
}
