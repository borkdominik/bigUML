package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.matcher.ClassDiagramCrossReferenceRemover;

public final class RemoveEnumerationCompoundCommand extends CompoundCommand {

   public RemoveEnumerationCompoundCommand(final ModelContext context,
      final Package parent,
      final Enumeration semanticElement) {
      this.append(new RemoveEnumerationSemanticCommand(context, parent, semanticElement));
      this.append(new UmlRemoveNotationElementCommand(context, semanticElement));

      new ClassDiagramCrossReferenceRemover(context).removeCommandsFor(semanticElement)
         .forEach(this::append);
   }
}
