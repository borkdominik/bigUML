package com.eclipsesource.uml.modelserver.old.diagram.objectdiagram.attribute;

public class AddAttributeCommandContribution { /*-{

    public static final String TYPE = "addAttribute";

    public static CCommand create(final String parentSemanticUri) {
        CCommand addAttributeCommand = CCommandFactory.eINSTANCE.createCommand();
        addAttributeCommand.setType(TYPE);
        addAttributeCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
        return addAttributeCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String parentSemanticUriFragment = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
        return new AddAttributeCommand(domain, modelUri, parentSemanticUriFragment);
    }   */
}
