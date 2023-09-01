package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.communication_path;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.CommunicationPath;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.reference.DeploymentDiagramCrossReferenceRemover;

public final class DeleteCommunicationPathCompoundCommand extends CompoundCommand {

   public DeleteCommunicationPathCompoundCommand(final ModelContext context, final CommunicationPath semanticElement) {
      this.append(new DeleteCommunicationPathSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      new DeploymentDiagramCrossReferenceRemover(context).deleteCommandsFor(semanticElement)
         .forEach(this::append);
   }

}
