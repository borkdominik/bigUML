package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.node;

public class AddNodeCommand { /*- {

   protected final Node newNode;
   protected String parentSemanticUriFragment;

   public AddNodeCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUri) {
      super(domain, modelUri);
      this.newNode = UMLFactory.eINSTANCE.createNode();
      this.parentSemanticUriFragment = parentSemanticUri;
   }

   @Override
   protected void doExecute() {
      newNode.setName(UmlSemanticCommandUtil.getNewNodeName(umlModel));
      NamedElement container = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, NamedElement.class);

      if (container instanceof Model) {
         ((Model) container).getPackagedElements().add(newNode);
      } else if (container instanceof ExecutionEnvironment) {
         ((ExecutionEnvironment) container).getNestedClassifiers().add(newNode);
      } else if (container instanceof Device) {
         ((Device) container).getNestedClassifiers().add(newNode);
      } else if (container instanceof Node) {
         ((Node) container).getNestedClassifiers().add(newNode);
      }

        /*if (container instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedClassifiers().add(newNode);
        } else if (container instanceof ExecutionEnvironment) {
            ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
                    parentSemanticUriFragment, ExecutionEnvironment.class);
            parentExecutionEnvironment.getNestedClassifiers().add(newNode);
        } else if (container instanceof Node) {
            Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
            parentNode.getNestedNodes().add(newNode);
        } else {
            umlModel.getPackagedElements().add(newNode);
        }*

   }

   public Node getNewNode() { return newNode; }   */
}
