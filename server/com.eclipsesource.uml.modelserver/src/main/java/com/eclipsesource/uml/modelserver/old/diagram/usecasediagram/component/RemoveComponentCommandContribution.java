package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.component;

public class RemoveComponentCommandContribution { /*-{

    public static final String TYPE = "removeComponent";

    public static CCompoundCommand create(final String semanticUri) {

        CCompoundCommand removeComponentCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeComponentCommand.setType(TYPE);
        removeComponentCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        return removeComponentCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveComponentCompoundCommand(domain, modelUri, semanticUriFragment);
    }
   */
}
