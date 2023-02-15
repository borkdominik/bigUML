package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.dependency;

import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteDependencySemanticCommand
   extends BaseDeleteSemanticChildCommand<Package, Dependency> {

   public DeleteDependencySemanticCommand(final ModelContext context, final Dependency semanticElement) {
      super(context, semanticElement.getNearestPackage(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final Dependency child) {
      parent.getPackagedElements().remove(child);
   }
}
