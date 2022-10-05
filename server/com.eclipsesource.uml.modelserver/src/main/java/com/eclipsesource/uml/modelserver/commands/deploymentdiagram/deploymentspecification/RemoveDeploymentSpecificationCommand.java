package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentspecification;

public class RemoveDeploymentSpecificationCommand { /*- {

    protected final String semanticUriFragment;
    protected final String parentSemanticUriFragment;

    public RemoveDeploymentSpecificationCommand(final EditingDomain domain, final URI modelUri,
                                                final String semanticUriFragment, final String parentSemanticUri) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.parentSemanticUriFragment = parentSemanticUri;
    }

    @Override
    protected void doExecute() {
        DeploymentSpecification deploymentSpecificationToRemove = UmlSemanticCommandUtil.getElement(umlModel,
                semanticUriFragment, DeploymentSpecification.class);
        EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);

        if (parentObject instanceof Artifact) {
            Artifact parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Artifact.class);
            parentNode.getNestedArtifacts().remove(deploymentSpecificationToRemove);
        } else if (parentObject instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedClassifiers().remove(deploymentSpecificationToRemove);
        } else if (parentObject instanceof ExecutionEnvironment) {
            ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
                    parentSemanticUriFragment, ExecutionEnvironment.class);
            parentExecutionEnvironment.getNestedClassifiers().remove(deploymentSpecificationToRemove);
        } else if (parentObject instanceof Node) {
            Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
            parentNode.getNestedClassifiers().remove(deploymentSpecificationToRemove);
        } else {
            umlModel.getPackagedElements().remove(deploymentSpecificationToRemove);
        }
    }
       */
}
