package com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_import;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageImport;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public final class CreatePackageImportSemanticCommand
   extends BaseCreateSemanticRelationCommand<PackageImport, Package, Package> {

   public CreatePackageImportSemanticCommand(final ModelContext context,
      final Package source, final Package target) {
      super(context, source, target);
   }

   @Override
   protected PackageImport createSemanticElement(final Package source, final Package target) {
      return source.createPackageImport(target);
   }

}
