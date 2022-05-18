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
      // Model is a subclass of Package; for this showcase we allow adding packages to Models, ususally this would not
      // be valid!
      // For the showcase of nestable elements we need to distinguish between adding it to the root (Model) or to
      // another nestable element (Package)
      Package parentContainer = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUri, Package.class);
      newPackage.setName(UmlSemanticCommandUtil.getNewPackageName(parentContainer));
      if (parentContainer instanceof Model) {
         Model.class.cast(parentContainer).getPackagedElements().add(newPackage);
      } else if (parentContainer instanceof Package) {
         Package.class.cast(parentContainer).getPackagedElements().add(newPackage);
      }
   }

   public Package getNewPackage() {
      return newPackage;
   }
}
