package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.artifact;

public class AddArtifactCommandContribution { /*-{

    public static final String TYPE = "addArtifactContributuion";

    public static CCompoundCommand create(final GPoint position, final String parentSemanticUri) {
        CCompoundCommand addArtifactCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addArtifactCommand.setType(TYPE);
        addArtifactCommand.getProperties().put(NotationKeys.POSITION_X,
                String.valueOf(position.getX()));
        addArtifactCommand.getProperties().put(NotationKeys.POSITION_Y,
                String.valueOf(position.getY()));
        addArtifactCommand.getProperties().put(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT,
                parentSemanticUri);
        return addArtifactCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        GPoint artifactPosition = UmlNotationCommandUtil.getGPoint(
                command.getProperties().get(NotationKeys.POSITION_X),
                command.getProperties().get(NotationKeys.POSITION_Y));

        String parentSemanticUriFragment = command.getProperties()
                .get(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT);

        return new AddArtifactCompoundCommand(domain, modelUri, artifactPosition,
                parentSemanticUriFragment);
    }
       */
}
