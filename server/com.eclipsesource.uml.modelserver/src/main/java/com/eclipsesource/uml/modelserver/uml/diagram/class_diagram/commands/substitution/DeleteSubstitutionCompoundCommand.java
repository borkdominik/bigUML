package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.substitution;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Substitution;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;

public final class DeleteSubstitutionCompoundCommand extends CompoundCommand {

   public DeleteSubstitutionCompoundCommand(final ModelContext context,
      final Substitution semanticElement) {
      this.append(new DeleteSubstitutionSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

   }

}
