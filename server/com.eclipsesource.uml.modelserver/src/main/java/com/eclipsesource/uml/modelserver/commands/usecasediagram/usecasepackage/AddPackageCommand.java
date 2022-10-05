package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage;

public class AddPackageCommand { /*- {

   protected final Package newPackage;
   protected final String parentSemanticUri;

   public AddPackageCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUri) {
      super(domain, modelUri);
      this.newPackage = UMLFactory.eINSTANCE.createPackage();
      this.parentSemanticUri = parentSemanticUri;
   }

   @Override
   protected void doExecute() {
      Package parentContainer = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUri, Package.class);
      newPackage.setName(UmlSemanticCommandUtil.getNewPackageName(parentContainer));
      if (parentContainer instanceof Model) {
         parentContainer.getPackagedElements().add(newPackage);
      } else if (parentContainer != null) {
         parentContainer.getPackagedElements().add(newPackage);
      }
   }

   public Package getNewPackage() {
      return newPackage;
   }   */
}
