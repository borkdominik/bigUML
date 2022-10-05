package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentspecification;

public class RemoveDeploymentSpecificationCommandContribution { /*-{

    public static final String TYPE = "removeDeploymentSpecification";

    public static CCompoundCommand create(final String semanticUri, final String parentSemanticUri) {
        CCompoundCommand removeDeploymentSpecificationCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeDeploymentSpecificationCommand.setType(TYPE);
        removeDeploymentSpecificationCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        removeDeploymentSpecificationCommand.getProperties().put(
                UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT,
                parentSemanticUri);
        return removeDeploymentSpecificationCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);

        String parentSemanticUriFragment = command.getProperties()
                .get(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT);

        return new RemoveDeploymentSpecificationCompoundCommand(domain, modelUri, semanticUriFragment,
                parentSemanticUriFragment);
    }   */
}
