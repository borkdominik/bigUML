package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.device;

public class AddDeviceCommand { /*- {

   protected final Device newDevice;
   protected final String parentSemanticUriFragment;

   public AddDeviceCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUri) {
      super(domain, modelUri);
      this.newDevice = UMLFactory.eINSTANCE.createDevice();
      this.parentSemanticUriFragment = parentSemanticUri;
   }

   @Override
   protected void doExecute() {
      newDevice.setName(UmlSemanticCommandUtil.getNewDeviceName(umlModel));

      NamedElement parentContainer = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, NamedElement.class);
      if (parentContainer instanceof Model) {
         ((Model) parentContainer).getPackagedElements().add(newDevice);
      } else if (parentContainer instanceof ExecutionEnvironment) {
         ((ExecutionEnvironment) parentContainer).getNestedClassifiers().add(newDevice);
      } else if (parentContainer instanceof Device) {
         ((Device) parentContainer).getNestedClassifiers().add(newDevice);
      } else if (parentContainer instanceof Node) {
         ((Node) parentContainer).getNestedClassifiers().add(newDevice);
      }
   }

   public Device getNewDevice() {
      return newDevice;
   }   */
}
