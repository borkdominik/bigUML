package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.CreateSemanticRelationCommand;

public final class AddGeneralizationSemanticCommand
   extends CreateSemanticRelationCommand<Classifier, Classifier, Generalization> {

   public AddGeneralizationSemanticCommand(final ModelContext context,
      final Classifier source, final Classifier target) {
      super(context, source, target);
   }

   @Override
   protected Generalization createSemanticElement(final Classifier source, final Classifier target) {
      return target.createGeneralization(source);
   }

}
