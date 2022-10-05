package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.device;

public class RemoveDeviceCommand { /*- {

    protected final String semanticUriFragment;
    protected final String parentSemanticUriFragment;

    public RemoveDeviceCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                               final String parentSemanticUri) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.parentSemanticUriFragment = parentSemanticUri;
    }

    @Override
    protected void doExecute() {
        Device deviceToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Device.class);
        umlModel.getPackagedElements().remove(deviceToRemove);

        EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);

        if (parentObject instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedNodes().remove(deviceToRemove);
        } else if (parentObject instanceof ExecutionEnvironment) {
            ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
                    parentSemanticUriFragment, ExecutionEnvironment.class);
            parentExecutionEnvironment.getNestedClassifiers().remove(deviceToRemove);
        } else if (parentObject instanceof Node) {
            Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
            parentNode.getNestedNodes().remove(deviceToRemove);
        } else {
            umlModel.getPackagedElements().remove(deviceToRemove);
        }
    }   */
}
