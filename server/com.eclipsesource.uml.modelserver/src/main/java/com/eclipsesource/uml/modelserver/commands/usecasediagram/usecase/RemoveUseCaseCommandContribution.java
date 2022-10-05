package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase;

public class RemoveUseCaseCommandContribution { /*-{

    public static final String TYPE = "removeUseCase";

    public static CCompoundCommand create(final String semanticUri) {
        CCompoundCommand removeUseCaseCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeUseCaseCommand.setType(TYPE);
        removeUseCaseCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        return removeUseCaseCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command) throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveUseCaseCompoundCommand(domain, modelUri, semanticUriFragment);
    }   */

}
