package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.realization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;

public final class CreateRealizationCompoundCommand extends CompoundCommand {

   public CreateRealizationCompoundCommand(final ModelContext context,
      final NamedElement source,
      final NamedElement target) {

      var command = new CreateRealizationSemanticCommand(context, source,
         target);
      this.append(command);
      this.append(new AddEdgeNotationCommand(context, command::getSemanticElement));
   }
}
