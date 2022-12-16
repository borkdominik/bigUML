package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlAddEdgeCommand;

public class AddGeneralizationCompoundCommand extends CompoundCommand {

   public AddGeneralizationCompoundCommand(final ModelContext context,
      final Classifier specific,
      final Classifier general) {

      var command = new AddGeneralizationSemanticCommand(context, specific,
         general);
      this.append(command);
      this.append(new UmlAddEdgeCommand(context, () -> command.getNewGeneralization()));
   }
}
