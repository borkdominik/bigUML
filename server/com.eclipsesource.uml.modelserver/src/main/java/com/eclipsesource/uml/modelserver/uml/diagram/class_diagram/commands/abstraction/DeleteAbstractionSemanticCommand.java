package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.abstraction;

import org.eclipse.uml2.uml.Abstraction;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteAbstractionSemanticCommand
   extends BaseDeleteSemanticChildCommand<Package, Abstraction> {

   public DeleteAbstractionSemanticCommand(final ModelContext context, final Abstraction semanticElement) {
      super(context, semanticElement.getNearestPackage(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final Abstraction child) {
      parent.getPackagedElements().remove(child);
   }
}
