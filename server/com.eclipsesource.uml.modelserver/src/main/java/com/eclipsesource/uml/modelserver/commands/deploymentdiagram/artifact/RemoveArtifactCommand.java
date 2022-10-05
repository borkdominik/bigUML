package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.artifact;

public class RemoveArtifactCommand { /*- {

    protected final String semanticUriFragment;
    protected String parentSemanticUriFragment;

    public RemoveArtifactCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                 final String parentSemanticUri) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.parentSemanticUriFragment = parentSemanticUri;
    }

    @Override
    protected void doExecute() {
        Artifact artifactToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Artifact.class);
        EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);

        if (parentObject instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedClassifiers().remove(artifactToRemove);
        } else if (parentObject instanceof ExecutionEnvironment) {
            ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
                    parentSemanticUriFragment, ExecutionEnvironment.class);
            parentExecutionEnvironment.getNestedClassifiers().remove(artifactToRemove);
        } else if (parentObject instanceof Node) {
            Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
            parentNode.getNestedClassifiers().remove(artifactToRemove);
        } else {
            umlModel.getPackagedElements().remove(artifactToRemove);
        }

    }
       */
}
