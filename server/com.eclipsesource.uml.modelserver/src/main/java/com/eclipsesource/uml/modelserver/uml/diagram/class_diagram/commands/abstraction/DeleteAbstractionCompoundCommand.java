package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.abstraction;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Abstraction;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;

public final class DeleteAbstractionCompoundCommand extends CompoundCommand {

   public DeleteAbstractionCompoundCommand(final ModelContext context, final Abstraction semanticElement) {
      this.append(new DeleteAbstractionSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

   }

}
