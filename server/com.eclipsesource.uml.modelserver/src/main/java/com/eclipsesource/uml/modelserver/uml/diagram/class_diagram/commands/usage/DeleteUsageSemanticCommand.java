package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.usage;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.Usage;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteUsageSemanticCommand
   extends BaseDeleteSemanticChildCommand<Package, Usage> {

   public DeleteUsageSemanticCommand(final ModelContext context,
      final Usage semanticElement) {
      super(context, semanticElement.getNearestPackage(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final Usage child) {
      parent.getPackagedElements().remove(child);
   }
}
