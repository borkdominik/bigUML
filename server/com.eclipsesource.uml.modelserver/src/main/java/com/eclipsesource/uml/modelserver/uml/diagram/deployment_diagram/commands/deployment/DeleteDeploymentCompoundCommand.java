package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Deployment;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.reference.DeploymentDiagramCrossReferenceRemover;

public final class DeleteDeploymentCompoundCommand extends CompoundCommand {

   public DeleteDeploymentCompoundCommand(final ModelContext context, final Deployment semanticElement) {
      this.append(new DeleteDeploymentSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      new DeploymentDiagramCrossReferenceRemover(context).deleteCommandsFor(semanticElement)
         .forEach(this::append);
   }

}
