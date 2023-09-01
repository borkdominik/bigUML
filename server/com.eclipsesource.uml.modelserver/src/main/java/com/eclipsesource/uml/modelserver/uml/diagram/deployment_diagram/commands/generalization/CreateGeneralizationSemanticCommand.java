package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.generalization;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public final class CreateGeneralizationSemanticCommand
   extends BaseCreateSemanticRelationCommand<Generalization, Classifier, Classifier> {

   public CreateGeneralizationSemanticCommand(final ModelContext context,
      final Classifier source, final Classifier target) {
      super(context, source, target);
   }

   @Override
   protected Generalization createSemanticElement(final Classifier source, final Classifier target) {
      return source.createGeneralization(target);
   }

}
