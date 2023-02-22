package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.realization;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.Realization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteRealizationSemanticCommand
   extends BaseDeleteSemanticChildCommand<Package, Realization> {

   public DeleteRealizationSemanticCommand(final ModelContext context,
      final Realization semanticElement) {
      super(context, semanticElement.getNearestPackage(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final Realization child) {
      parent.getPackagedElements().remove(child);
   }
}
