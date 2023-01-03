package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Interface;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.matcher.ClassDiagramCrossReferenceRemover;

public final class DeleteInterfaceCompoundCommand extends CompoundCommand {

   public DeleteInterfaceCompoundCommand(final ModelContext context, final Interface semanticElement) {
      this.append(new DeleteInterfaceSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      new ClassDiagramCrossReferenceRemover(context).deleteCommandsFor(semanticElement)
         .forEach(this::append);
   }
}
