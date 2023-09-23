package com.eclipsesource.uml.modelserver.uml.elements.substitution.commands;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Substitution;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public final class CreateSubstitutionSemanticCommand
   extends BaseCreateSemanticRelationCommand<Substitution, Classifier, Classifier> {

   public CreateSubstitutionSemanticCommand(final ModelContext context,
      final Classifier source, final Classifier target) {
      super(context, source, target);
   }

   @Override
   protected Substitution createSemanticElement(final Classifier source, final Classifier target) {
      return source.createSubstitution(null, target);
   }

}
