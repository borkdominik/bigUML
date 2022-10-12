package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.includeedge;

public class RemoveIncludeCommandContribution { /*-{

    public static final String TYPE = "removeInlcude";

    public static CCompoundCommand create(final String semanticUriFragment) {
        CCompoundCommand removeIncludeCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeIncludeCommand.setType(TYPE);
        removeIncludeCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUriFragment);
        return removeIncludeCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
        throws DecodingException {
        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveIncludeCompoundCommand(domain, modelUri, semanticUriFragment);
    }   */
}
