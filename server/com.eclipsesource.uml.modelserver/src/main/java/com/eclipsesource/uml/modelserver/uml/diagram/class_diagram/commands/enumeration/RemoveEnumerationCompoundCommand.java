package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Enumeration;

import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.matcher.ClassDiagramCrossReferenceRemover;

public class RemoveEnumerationCompoundCommand extends CompoundCommand {

   public RemoveEnumerationCompoundCommand(final EditingDomain domain, final URI modelUri,
      final Enumeration enumeration) {
      this.append(new RemoveEnumerationSemanticCommand(domain, modelUri, enumeration));
      this.append(new UmlRemoveNotationElementCommand(domain, modelUri, enumeration));

      new ClassDiagramCrossReferenceRemover(domain, modelUri).removeCommandsFor(enumeration)
         .forEach(this::append);
   }
}
