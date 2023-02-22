package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.abstraction;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Abstraction;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.reference.ClassDiagramCrossReferenceRemover;

public final class DeleteAbstractionCompoundCommand extends CompoundCommand {

   public DeleteAbstractionCompoundCommand(final ModelContext context, final Abstraction semanticElement) {
      this.append(new DeleteAbstractionSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      new ClassDiagramCrossReferenceRemover(context).deleteCommandsFor(semanticElement)
         .forEach(this::append);
   }

}
