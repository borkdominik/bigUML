package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.generalization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.reference.DeploymentDiagramCrossReferenceRemover;

public final class DeleteGeneralizationCompoundCommand extends CompoundCommand {

   public DeleteGeneralizationCompoundCommand(final ModelContext context, final Generalization semanticElement) {
      this.append(new DeleteGeneralizationSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      new DeploymentDiagramCrossReferenceRemover(context).deleteCommandsFor(semanticElement)
         .forEach(this::append);
   }

}
