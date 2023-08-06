package com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_merge;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageMerge;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeletePackageMergeSemanticCommand
   extends BaseDeleteSemanticChildCommand<Package, PackageMerge> {

   public DeletePackageMergeSemanticCommand(final ModelContext context,
      final PackageMerge semanticElement) {
      super(context, semanticElement.getNearestPackage(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final PackageMerge child) {
      parent.getPackageMerges().remove(child);
   }
}
