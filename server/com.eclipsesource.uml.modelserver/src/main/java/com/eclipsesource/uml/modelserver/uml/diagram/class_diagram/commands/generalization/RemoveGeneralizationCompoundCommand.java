package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;

public class RemoveGeneralizationCompoundCommand extends CompoundCommand {

   public RemoveGeneralizationCompoundCommand(final ModelContext context,
      final Generalization generalization) {
      this.append(new RemoveGeneralizationSemanticCommand(context, generalization));
      this.append(new UmlRemoveNotationElementCommand(context, generalization));

   }

}
