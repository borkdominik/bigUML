package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interface;

import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.reference_matcher.ClassDiagramCrossReferenceRemover;

public class RemoveInterfaceCompoundCommand extends CompoundCommand {

   public RemoveInterfaceCompoundCommand(final EditingDomain domain, final URI modelUri,
      final Interface interfaceToRemove) {
      this.append(new RemoveInterfaceSemanticCommand(domain, modelUri, interfaceToRemove));
      this.append(new UmlRemoveNotationElementCommand(domain, modelUri, interfaceToRemove));

      new ClassDiagramCrossReferenceRemover(domain, modelUri).removeCommandsFor(interfaceToRemove)
         .forEach(this::append);
   }
}
