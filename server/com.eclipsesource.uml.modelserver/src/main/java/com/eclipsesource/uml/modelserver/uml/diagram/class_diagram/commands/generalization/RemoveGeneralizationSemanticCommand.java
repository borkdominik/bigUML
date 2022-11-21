package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemoveGeneralizationSemanticCommand extends UmlSemanticElementCommand {

   protected final Generalization generalizationToRemove;

   public RemoveGeneralizationSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Generalization generalizationToRemove) {
      super(domain, modelUri);
      this.generalizationToRemove = generalizationToRemove;
   }

   @Override
   protected void doExecute() {
      model.getPackagedElements().remove(generalizationToRemove);
   }

}
