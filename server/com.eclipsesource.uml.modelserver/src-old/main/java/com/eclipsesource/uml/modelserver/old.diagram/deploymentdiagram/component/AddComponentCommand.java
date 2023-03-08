package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.component;

public class AddComponentCommand { /*- {

   protected final Component newComponent;
   protected final String parentSemanticUriFragment;

   public AddComponentCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.newComponent = UMLFactory.eINSTANCE.createComponent();
      this.parentSemanticUriFragment = null;
   }

   public AddComponentCommand(final EditingDomain domain, final URI modelUri, final String parentUri) {
      super(domain, modelUri);
      this.newComponent = UMLFactory.eINSTANCE.createComponent();
      this.parentSemanticUriFragment = parentUri;
   }

   @Override
   protected void doExecute() {
      newComponent.setName(UmlSemanticCommandUtil.getNewPackageableElementName(umlModel, Component.class));

      if (parentSemanticUriFragment == null) {
         umlModel.getPackagedElements().add(newComponent);
      } else {
         EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);
         // TODO: add other elements later!
         if (parentObject instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedClassifiers().add(newComponent);
         }
      }
   }

   public Component getNewComponent() {
      return newComponent;
   }
      */
}
