package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.includeedge;

public class AddIncludeCommandContribution { /*-{

    public static final String TYPE = "addIncludeContribution";
    public static final String SOURCE_USECASE_URI_FRAGMENT = "sourceUseCaseUriFragment";
    public static final String TARGET_USECASE_URI_FRAGMENT = "targetUseCaseUriFragment";

    public static CCompoundCommand create(final String sourceUseCaseUriFragment, final String targetUseCaseUriFragment) {
        CCompoundCommand addIncludeCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addIncludeCommand.setType(TYPE);
        addIncludeCommand.getProperties().put(SOURCE_USECASE_URI_FRAGMENT, sourceUseCaseUriFragment);
        addIncludeCommand.getProperties().put(TARGET_USECASE_URI_FRAGMENT, targetUseCaseUriFragment);
        return addIncludeCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        String sourceUseCaseUriFragment = command.getProperties().get(SOURCE_USECASE_URI_FRAGMENT);
        String targetUseCaseUriFragment = command.getProperties().get(TARGET_USECASE_URI_FRAGMENT);

        return new AddIncludeCompoundCommand(domain, modelUri, sourceUseCaseUriFragment, targetUseCaseUriFragment);
    }   */
}
