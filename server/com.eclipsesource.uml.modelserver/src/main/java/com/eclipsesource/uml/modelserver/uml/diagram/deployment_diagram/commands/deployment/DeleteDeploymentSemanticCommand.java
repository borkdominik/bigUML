package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment;

import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteDeploymentSemanticCommand
   extends BaseDeleteSemanticChildCommand<Model, Deployment> {

   public DeleteDeploymentSemanticCommand(final ModelContext context, final Deployment semanticElement) {
      super(context, semanticElement.getModel(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Model parent, final Deployment child) {
      parent.getPackagedElements().remove(child);
   }
}
