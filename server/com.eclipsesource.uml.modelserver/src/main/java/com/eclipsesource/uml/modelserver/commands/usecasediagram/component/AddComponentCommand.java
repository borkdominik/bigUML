package com.eclipsesource.uml.modelserver.commands.usecasediagram.component;

public class AddComponentCommand { /*- {

   protected final Component newComponent;
   protected final String parentSemanticUri;

   public AddComponentCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUri) {
      super(domain, modelUri);
      this.newComponent = UMLFactory.eINSTANCE.createComponent();
      this.parentSemanticUri = parentSemanticUri;
   }

   @Override
   protected void doExecute() {
      Package parentContainer = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUri, Package.class);
      newComponent.setName(UmlSemanticCommandUtil.getNewComponentName(umlModel));
      if (parentContainer instanceof Model) {
         parentContainer.getPackagedElements().add(newComponent);
      } else if (parentContainer != null) {
         parentContainer.getPackagedElements().add(newComponent);
      }
   }

   public Component getNewComponent() {
      return newComponent;
   }
      */
}
