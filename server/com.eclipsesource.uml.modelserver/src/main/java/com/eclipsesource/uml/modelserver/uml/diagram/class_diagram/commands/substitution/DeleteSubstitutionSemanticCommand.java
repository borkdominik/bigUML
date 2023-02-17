package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.substitution;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Substitution;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteSubstitutionSemanticCommand
   extends BaseDeleteSemanticChildCommand<Classifier, Substitution> {

   public DeleteSubstitutionSemanticCommand(final ModelContext context,
      final Substitution semanticElement) {
      super(context, semanticElement.getSubstitutingClassifier(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Classifier parent, final Substitution child) {
      parent.getSubstitutions().remove(child);
   }
}
