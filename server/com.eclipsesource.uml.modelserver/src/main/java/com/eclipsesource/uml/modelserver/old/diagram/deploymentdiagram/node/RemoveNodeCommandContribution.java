package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.node;

public class RemoveNodeCommandContribution { /*-{

    public static final String TYPE = "removeNode";

    public static CCompoundCommand create(final String semanticUri, final String parentSemanticUri) {
        CCompoundCommand removeNodeCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeNodeCommand.setType(TYPE);
        removeNodeCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        removeNodeCommand.getProperties().put(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT,
                parentSemanticUri);

        return removeNodeCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        String parentUriFragment = command.getProperties()
                .get(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT);
        return new RemoveNodeCompoundCommand(domain, modelUri, semanticUriFragment, parentUriFragment);
    }   */
}
