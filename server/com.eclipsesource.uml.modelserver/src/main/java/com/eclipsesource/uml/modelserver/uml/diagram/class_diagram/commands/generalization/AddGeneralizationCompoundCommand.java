package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlAddEdgeCommand;

public final class AddGeneralizationCompoundCommand extends CompoundCommand {

   public AddGeneralizationCompoundCommand(final ModelContext context,
      final Classifier source,
      final Classifier target) {

      var command = new AddGeneralizationSemanticCommand(context, source,
         target);
      this.append(command);
      this.append(new UmlAddEdgeCommand(context, command::getSemanticElement));
   }
}
