package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.interface_realization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.InterfaceRealization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;

public final class DeleteInterfaceRealizationCompoundCommand extends CompoundCommand {

   public DeleteInterfaceRealizationCompoundCommand(final ModelContext context,
      final InterfaceRealization semanticElement) {
      this.append(new DeleteInterfaceRealizationSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

   }

}
