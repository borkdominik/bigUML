package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.dependency;

import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteDependencySemanticCommand
   extends BaseDeleteSemanticChildCommand<Model, Dependency> {

   public DeleteDependencySemanticCommand(final ModelContext context, final Dependency semanticElement) {
      super(context, semanticElement.getModel(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Model parent, final Dependency child) {
      parent.getPackagedElements().remove(child);
   }
}
