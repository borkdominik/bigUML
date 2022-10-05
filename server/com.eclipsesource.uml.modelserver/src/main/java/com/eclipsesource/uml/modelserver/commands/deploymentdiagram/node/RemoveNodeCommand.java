package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.node;

public class RemoveNodeCommand { /*- {

    protected final String semanticUriFragment;
    protected String parentSemanticUriFragment;

    public RemoveNodeCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                             final String parentSemanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.parentSemanticUriFragment = parentSemanticUriFragment;
    }

    @Override
    protected void doExecute() {
        EObject container = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);
        Node nodeToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Node.class);

        if (container instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedNodes().remove(nodeToRemove);
        } else if (container instanceof ExecutionEnvironment) {
            ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
                    parentSemanticUriFragment, ExecutionEnvironment.class);
            parentExecutionEnvironment.getNestedClassifiers().remove(nodeToRemove);
        } else if (container instanceof Node) {
            Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
            parentNode.getNestedNodes().remove(nodeToRemove);
        } else {
            umlModel.getPackagedElements().remove(nodeToRemove);
        }
    }   */
}
