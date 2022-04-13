package com.eclipsesource.uml.modelserver.commands.classdiagram.generalization;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Generalization;
import org.eclipse.uml2.uml.UMLFactory;

public class AddClassGeneralizationCommand extends UmlSemanticElementCommand {

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
}
