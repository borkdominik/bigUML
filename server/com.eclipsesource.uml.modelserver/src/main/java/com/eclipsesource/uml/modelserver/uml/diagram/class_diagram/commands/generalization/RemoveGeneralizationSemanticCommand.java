package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemoveGeneralizationSemanticCommand extends UmlSemanticElementCommand {

   protected final Generalization generalization;

   public RemoveGeneralizationSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Generalization generalization) {
      super(domain, modelUri);
      this.generalization = generalization;
   }

   @Override
   protected void doExecute() {
      var classifier = generalization.getSpecific();
      classifier.getGeneralizations().remove(generalization);
   }

}
