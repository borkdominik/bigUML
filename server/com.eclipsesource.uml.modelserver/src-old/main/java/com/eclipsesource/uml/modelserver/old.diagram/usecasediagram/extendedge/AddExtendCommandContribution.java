package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.extendedge;

public class AddExtendCommandContribution { /*-{

    public static final String TYPE = "addExtendContribution";
    public static final String EXTENDING_USECASE_URI_FRAGMENT = "extendingUriUseCaseUriFragment";
    public static final String EXTENDED_USECASE_URI_FRAGMENT = "extendedUriUseCaseUriFragment";

    public static CCompoundCommand create(final String extendingUseCaseUri, final String extendedUseCaseUri) {
        CCompoundCommand extendedUseCaseCompoundCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        extendedUseCaseCompoundCommand.setType(TYPE);
        extendedUseCaseCompoundCommand.getProperties().put(EXTENDING_USECASE_URI_FRAGMENT, extendingUseCaseUri);
        extendedUseCaseCompoundCommand.getProperties().put(EXTENDED_USECASE_URI_FRAGMENT, extendedUseCaseUri);
        return extendedUseCaseCompoundCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
        throws DecodingException {
        String extendingUseCaseUri = command.getProperties().get(EXTENDING_USECASE_URI_FRAGMENT);
        String extendedUseCaseUri = command.getProperties().get(EXTENDED_USECASE_URI_FRAGMENT);
        return new AddExtendCompoundCommand(domain, modelUri, extendingUseCaseUri, extendedUseCaseUri);
    }   */
}
