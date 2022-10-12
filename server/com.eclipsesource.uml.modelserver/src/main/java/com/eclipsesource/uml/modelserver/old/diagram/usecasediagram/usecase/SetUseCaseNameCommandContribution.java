package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.usecase;

// TODO: Add this later again
public class SetUseCaseNameCommandContribution { /*-{

    public static final String TYPE = "setUseCaseName";
    public static final String NEW_NAME = "newName";

    public static CCommand create(final String semanticUri, final String newName) {
        CCommand setUsecaseNameCommand = CCommandFactory.eINSTANCE.createCommand();
        setUsecaseNameCommand.setType(TYPE);
        setUsecaseNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        setUsecaseNameCommand.getProperties().put(NEW_NAME, newName);
        return setUsecaseNameCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        String newName = command.getProperties().get(NEW_NAME);

        return new SetNameCommand(domain, modelUri, semanticUriFragment, newName);
    }   */

}
