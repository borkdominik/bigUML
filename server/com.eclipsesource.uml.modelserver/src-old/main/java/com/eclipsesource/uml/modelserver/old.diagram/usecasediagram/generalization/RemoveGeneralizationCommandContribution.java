package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.generalization;

public class RemoveGeneralizationCommandContribution { /*-{

    public static final String TYPE = "removeGeneralization";

    public static CCompoundCommand create(final String semanticUriFragment) {
        CCompoundCommand removeGeneralizationCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeGeneralizationCommand.setType(TYPE);
        removeGeneralizationCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUriFragment);
        return removeGeneralizationCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
        throws DecodingException {
        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveGeneralizationCompoundCommand(domain, modelUri, semanticUriFragment);
    }   */
}
