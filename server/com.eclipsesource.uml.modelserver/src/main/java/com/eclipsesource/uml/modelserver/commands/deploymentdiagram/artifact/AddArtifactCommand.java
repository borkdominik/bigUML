package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.artifact;

public class AddArtifactCommand { /*- {

   protected final Artifact newArtifact;
   protected String parentSemanticUriFragment;

   public AddArtifactCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUri) {
      super(domain, modelUri);
      this.newArtifact = UMLFactory.eINSTANCE.createArtifact();
      this.parentSemanticUriFragment = parentSemanticUri;
   }

   @Override
   protected void doExecute() {
      newArtifact.setName(UmlSemanticCommandUtil.getNewArtifactName(umlModel));

      NamedElement parentContainer = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, NamedElement.class);

      if (parentContainer instanceof Model) {
         ((Model) parentContainer).getPackagedElements().add(newArtifact);
      } else if (parentContainer instanceof ExecutionEnvironment) {
         ((ExecutionEnvironment) parentContainer).getNestedClassifiers().add(newArtifact);
      } else if (parentContainer instanceof Device) {
         ((Device) parentContainer).getNestedClassifiers().add(newArtifact);
      } else if (parentContainer instanceof Node) {
         ((Node) parentContainer).getNestedClassifiers().add(newArtifact);
      }
   }

   public Artifact getNewArtifact() {
      return newArtifact;
   }
      */
}
