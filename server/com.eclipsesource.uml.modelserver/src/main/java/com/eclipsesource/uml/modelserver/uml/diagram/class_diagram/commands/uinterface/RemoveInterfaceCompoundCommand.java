package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Interface;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.matcher.ClassDiagramCrossReferenceRemover;

public class RemoveInterfaceCompoundCommand extends CompoundCommand {

   public RemoveInterfaceCompoundCommand(final ModelContext context,
      final Interface interfaceToRemove) {
      this.append(new RemoveInterfaceSemanticCommand(context, interfaceToRemove));
      this.append(new UmlRemoveNotationElementCommand(context, interfaceToRemove));

      new ClassDiagramCrossReferenceRemover(context).removeCommandsFor(interfaceToRemove)
         .forEach(this::append);
   }
}
