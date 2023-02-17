package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.usage;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Usage;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;

public final class DeleteUsageCompoundCommand extends CompoundCommand {

   public DeleteUsageCompoundCommand(final ModelContext context,
      final Usage semanticElement) {
      this.append(new DeleteUsageSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

   }

}
