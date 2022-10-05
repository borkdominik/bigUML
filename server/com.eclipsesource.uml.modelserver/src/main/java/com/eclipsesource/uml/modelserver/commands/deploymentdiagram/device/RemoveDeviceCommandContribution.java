package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.device;

public class RemoveDeviceCommandContribution { /*-{

    public static final String TYPE = "removeDevice";

    public static CCompoundCommand create(final String semanticUri, final String parentSemanticUri) {
        CCompoundCommand removeDeviceCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeDeviceCommand.setType(TYPE);
        removeDeviceCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        removeDeviceCommand.getProperties().put(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT,
                parentSemanticUri);
        return removeDeviceCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);

        String parentSemanticUriFragment = command.getProperties()
                .get(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT);

        return new RemoveDeviceCompoundCommand(domain, modelUri, semanticUriFragment, parentSemanticUriFragment);
    }   */
}
