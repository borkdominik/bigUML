package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.executionenvironment;

public class AddExecutionEnvironmentCommand { /*- {

   protected final ExecutionEnvironment newExecutionEnvironment;
   protected final String parentSemanticUriFragment;

   public AddExecutionEnvironmentCommand(final EditingDomain domain, final URI modelUri,
                                         final String parentSemanticUri) {
      super(domain, modelUri);
      this.newExecutionEnvironment = UMLFactory.eINSTANCE.createExecutionEnvironment();
      this.parentSemanticUriFragment = parentSemanticUri;
   }

   @Override
   protected void doExecute() {
      newExecutionEnvironment.setName(UmlSemanticCommandUtil.getNewExecutionEnvironmentName(umlModel));
      NamedElement parentContainer = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, NamedElement.class);
      if (parentContainer instanceof Model) {
         ((Model) parentContainer).getPackagedElements().add(newExecutionEnvironment);
      } else if (parentContainer instanceof ExecutionEnvironment) {
         ((ExecutionEnvironment) parentContainer).getNestedClassifiers().add(newExecutionEnvironment);
      } else if (parentContainer instanceof Device) {
         ((Device) parentContainer).getNestedClassifiers().add(newExecutionEnvironment);
      } else if (parentContainer instanceof Node) {
         ((Node) parentContainer).getNestedClassifiers().add(newExecutionEnvironment);
      }

        /*EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);
        if (parentObject instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedNodes().add(newExecutionEnvironment);
        } else if (parentObject instanceof ExecutionEnvironment) {
            ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
                    parentSemanticUriFragment, ExecutionEnvironment.class);
            parentExecutionEnvironment.getNestedNodes().add(newExecutionEnvironment);
        } else if (parentObject instanceof Node) {
            Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
            parentNode.getNestedNodes().add(newExecutionEnvironment);
        } else {
            umlModel.getPackagedElements().add(newExecutionEnvironment);
        }*
   }

   public ExecutionEnvironment getNewExecutionEnvironment() { return newExecutionEnvironment; }
      */
}
