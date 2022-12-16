package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Enumeration;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.matcher.ClassDiagramCrossReferenceRemover;

public class RemoveEnumerationCompoundCommand extends CompoundCommand {

   public RemoveEnumerationCompoundCommand(final ModelContext context,
      final Enumeration enumeration) {
      this.append(new RemoveEnumerationSemanticCommand(context, enumeration));
      this.append(new UmlRemoveNotationElementCommand(context, enumeration));

      new ClassDiagramCrossReferenceRemover(context).removeCommandsFor(enumeration)
         .forEach(this::append);
   }
}
