package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.generalization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;

public final class CreateGeneralizationCompoundCommand extends CompoundCommand {

   public CreateGeneralizationCompoundCommand(final ModelContext context,
      final Classifier source,
      final Classifier target) {

      var command = new CreateGeneralizationSemanticCommand(context, source,
         target);
      this.append(command);
      this.append(new AddEdgeNotationCommand(context, command::getSemanticElement));
   }
}
