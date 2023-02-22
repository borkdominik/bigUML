package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.substitution;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;

public final class CreateSubstitutionCompoundCommand extends CompoundCommand {

   public CreateSubstitutionCompoundCommand(final ModelContext context,
      final Classifier source,
      final Classifier target) {

      var command = new CreateSubstitutionSemanticCommand(context, source,
         target);
      this.append(command);
      this.append(new AddEdgeNotationCommand(context, command::getSemanticElement));
   }
}
