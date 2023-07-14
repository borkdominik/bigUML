package com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_import;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageImport;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeletePackageImportSemanticCommand
   extends BaseDeleteSemanticChildCommand<Package, PackageImport> {

   public DeletePackageImportSemanticCommand(final ModelContext context,
      final PackageImport semanticElement) {
      super(context, semanticElement.getNearestPackage(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final PackageImport child) {
      parent.getPackageImports().remove(child);
   }
}
