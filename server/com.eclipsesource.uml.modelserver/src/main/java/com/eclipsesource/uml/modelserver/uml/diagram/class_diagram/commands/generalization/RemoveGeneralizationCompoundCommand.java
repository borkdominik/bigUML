package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;

public class RemoveGeneralizationCompoundCommand extends CompoundCommand {

   public RemoveGeneralizationCompoundCommand(final ModelContext context,
      final Classifier parent,
      final Generalization semanticElement) {
      this.append(new RemoveGeneralizationSemanticCommand(context, parent, semanticElement));
      this.append(new UmlRemoveNotationElementCommand(context, semanticElement));

   }

}
