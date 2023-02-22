package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.interface_realization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Interface;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;

public final class CreateInterfaceRealizationCompoundCommand extends CompoundCommand {

   public CreateInterfaceRealizationCompoundCommand(final ModelContext context,
      final Class source,
      final Interface target) {

      var command = new CreateInterfaceRealizationSemanticCommand(context, source,
         target);
      this.append(command);
      this.append(new AddEdgeNotationCommand(context, command::getSemanticElement));
   }
}
