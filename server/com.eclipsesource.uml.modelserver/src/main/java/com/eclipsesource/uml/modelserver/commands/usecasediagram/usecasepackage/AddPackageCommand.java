package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;

public class AddPackageCommand extends UmlSemanticElementCommand {

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
      } else if (parentContainer instanceof Package) {
         parentContainer.getPackagedElements().add(newPackage);
      }
   }

   public Package getNewPackage() {
      return newPackage;
   }
}
