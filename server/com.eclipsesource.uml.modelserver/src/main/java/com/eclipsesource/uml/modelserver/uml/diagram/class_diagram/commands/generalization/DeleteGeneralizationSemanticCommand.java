package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteGeneralizationSemanticCommand
   extends BaseDeleteSemanticChildCommand<Classifier, Generalization> {

   public DeleteGeneralizationSemanticCommand(final ModelContext context, final Generalization semanticElement) {
      super(context, semanticElement.getSpecific(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Classifier parent, final Generalization child) {
      parent.getGeneralizations().remove(child);
   }
}
