package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.artifact;

public class RemoveArtifactCommandContribution { /*-{

    public static final String TYPE = "removeArtifact";

    public static CCompoundCommand create(final String semanticUri, final String parentSemanticUri) {
        CCompoundCommand removeArtifactCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeArtifactCommand.setType(TYPE);
        removeArtifactCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        removeArtifactCommand.getProperties().put(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT,
                parentSemanticUri);
        return removeArtifactCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);

        String parentSemanticUriFragment = command.getProperties()
                .get(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT);

        return new RemoveArtifactCompoundCommand(domain, modelUri, semanticUriFragment, parentSemanticUriFragment);

    }
       */
}
