package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.manifestation;

import org.eclipse.uml2.uml.Manifestation;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteManifestationSemanticCommand
   extends BaseDeleteSemanticChildCommand<Model, Manifestation> {

   public DeleteManifestationSemanticCommand(final ModelContext context, final Manifestation semanticElement) {
      super(context, semanticElement.getModel(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Model parent, final Manifestation child) {
      parent.getPackagedElements().remove(child);
   }
}
