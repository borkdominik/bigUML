package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.realization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Realization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;

public final class DeleteRealizationCompoundCommand extends CompoundCommand {

   public DeleteRealizationCompoundCommand(final ModelContext context,
      final Realization semanticElement) {
      this.append(new DeleteRealizationSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

   }

}
