package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.manifestation;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Manifestation;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.reference.DeploymentDiagramCrossReferenceRemover;

public final class DeleteManifestationCompoundCommand extends CompoundCommand {

   public DeleteManifestationCompoundCommand(final ModelContext context, final Manifestation semanticElement) {
      this.append(new DeleteManifestationSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      new DeploymentDiagramCrossReferenceRemover(context).deleteCommandsFor(semanticElement)
         .forEach(this::append);
   }

}
