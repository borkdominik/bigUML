package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.communication_path;

import org.eclipse.uml2.uml.CommunicationPath;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteCommunicationPathSemanticCommand
   extends BaseDeleteSemanticChildCommand<Model, CommunicationPath> {

   public DeleteCommunicationPathSemanticCommand(final ModelContext context, final CommunicationPath semanticElement) {
      super(context, semanticElement.getModel(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Model parent, final CommunicationPath child) {
      parent.getPackagedElements().remove(child);
   }
}
