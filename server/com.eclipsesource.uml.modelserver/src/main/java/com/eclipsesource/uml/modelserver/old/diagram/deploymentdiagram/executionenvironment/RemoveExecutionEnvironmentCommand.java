package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.executionenvironment;

public class RemoveExecutionEnvironmentCommand { /*- {

    protected final String semanticUriFragment;
    protected String parentSemanticUriFragment;

    public RemoveExecutionEnvironmentCommand(final EditingDomain domain, final URI modelUri,
                                             final String semanticUriFragment, final String parentSemanticUri) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.parentSemanticUriFragment = parentSemanticUri;
    }

    @Override
    protected void doExecute() {
        ExecutionEnvironment executionEnvironmentToRemove = UmlSemanticCommandUtil.getElement(umlModel,
                semanticUriFragment, ExecutionEnvironment.class);
        EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);

        if (parentObject instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedNodes().remove(executionEnvironmentToRemove);
        } else if (parentObject instanceof ExecutionEnvironment) {
            ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
                    parentSemanticUriFragment, ExecutionEnvironment.class);
            parentExecutionEnvironment.getNestedNodes().remove(executionEnvironmentToRemove);
        } else if (parentObject instanceof Node) {
            Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
            parentNode.getNestedNodes().remove(executionEnvironmentToRemove);
        } else {
            umlModel.getPackagedElements().remove(executionEnvironmentToRemove);
        }
    }
       */
}
