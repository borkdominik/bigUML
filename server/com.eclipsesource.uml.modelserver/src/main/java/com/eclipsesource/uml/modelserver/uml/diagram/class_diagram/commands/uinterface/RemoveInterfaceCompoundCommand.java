package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.matcher.ClassDiagramCrossReferenceRemover;

public final class RemoveInterfaceCompoundCommand extends CompoundCommand {

   public RemoveInterfaceCompoundCommand(final ModelContext context,
      final Package parent,
      final Interface semanticElement) {
      this.append(new RemoveInterfaceSemanticCommand(context, parent, semanticElement));
      this.append(new UmlRemoveNotationElementCommand(context, semanticElement));

      new ClassDiagramCrossReferenceRemover(context).removeCommandsFor(semanticElement)
         .forEach(this::append);
   }
}
