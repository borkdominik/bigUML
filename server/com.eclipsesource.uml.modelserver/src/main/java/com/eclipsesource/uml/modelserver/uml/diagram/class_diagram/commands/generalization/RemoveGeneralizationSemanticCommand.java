package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.DeleteSemanticChildCommand;

public class RemoveGeneralizationSemanticCommand extends DeleteSemanticChildCommand<Classifier, Generalization> {

   public RemoveGeneralizationSemanticCommand(final ModelContext context,
      final Classifier parent, final Generalization semanticElement) {
      super(context, parent, semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Classifier parent, final Generalization child) {
      parent.getGeneralizations().remove(child);
   }
}
