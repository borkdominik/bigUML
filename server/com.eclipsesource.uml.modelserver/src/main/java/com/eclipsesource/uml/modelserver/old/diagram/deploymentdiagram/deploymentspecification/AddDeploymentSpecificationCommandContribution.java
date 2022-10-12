package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.deploymentspecification;

public class AddDeploymentSpecificationCommandContribution { /*-{

    public static final String TYPE = "addDeploymentSpecificationContributuion";

    public static CCompoundCommand create(final GPoint position, final String parentSemanticUri) {
        CCompoundCommand addDeploymentSpecificationCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addDeploymentSpecificationCommand.setType(TYPE);
        addDeploymentSpecificationCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
                String.valueOf(position.getX()));
        addDeploymentSpecificationCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
                String.valueOf(position.getY()));
        addDeploymentSpecificationCommand.getProperties().put(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT,
                parentSemanticUri);
        return addDeploymentSpecificationCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        GPoint deploymentSpecificationPosition = UmlNotationCommandUtil.getGPoint(
                command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
                command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

        String parentSemanticUriFragment = command.getProperties()
                .get(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT);

        return new AddDeploymentSpecificationCompoundCommand(domain, modelUri, deploymentSpecificationPosition,
                parentSemanticUriFragment);
    }   */

}
