package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.usecasepackage;

public class SetPackageNameCommandContribution { /*-{

    public static final String TYPE = "setPackageName";
    public static final String NEW_NAME = "newName";

    public static CCommand create(final String semanticUri, final String newName) {
        CCommand setPackageNameCommand = CCommandFactory.eINSTANCE.createCommand();
        setPackageNameCommand.setType(TYPE);
        setPackageNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        setPackageNameCommand.getProperties().put(NEW_NAME, newName);
        return setPackageNameCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
        throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        String newName = command.getProperties().get(NEW_NAME);

        return new SetNameCommand(domain, modelUri, semanticUriFragment, newName);
    }   */
}
