package com.eclipsesource.uml.modelserver.old.diagram.classdiagram.generalization;

public class AddClassGeneralizationCommand { /*- {

   private final Generalization newGeneralization;
   protected final Classifier generalClass;
   protected final Classifier specificClass;

   public AddClassGeneralizationCommand(final EditingDomain domain, final URI modelUri,
                                        final String sourceClassUriFragment, final String targetClassUriFragment) {
      super(domain, modelUri);
      System.out.println("ADDCLASSGENERALIZATIONCOMMAND");
      this.newGeneralization = UMLFactory.eINSTANCE.createGeneralization();
      this.generalClass = UmlSemanticCommandUtil.getElement(umlModel, sourceClassUriFragment, Class.class);
      this.specificClass = UmlSemanticCommandUtil.getElement(umlModel, targetClassUriFragment, Class.class);
   }

   @Override
   protected void doExecute() {
      System.out.println("ADDCLASSGENERALIZATIONCOMMAND - do execute");
      generalClass.getGeneralizations().add(getNewGeneralization());
      getNewGeneralization().setGeneral(generalClass);
      getNewGeneralization().setSpecific(specificClass);
   }

   public Generalization getNewGeneralization() {
      return newGeneralization;
   }
      */
}
