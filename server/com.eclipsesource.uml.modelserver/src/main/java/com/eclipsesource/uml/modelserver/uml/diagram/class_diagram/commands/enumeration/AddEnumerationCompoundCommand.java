package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;

public class AddEnumerationCompoundCommand extends CompoundCommand {

   public AddEnumerationCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      var semanticCommand = new AddEnumerationSemanticCommand(domain, modelUri);
      this.append(semanticCommand);
      this.append(new AddEnumerationNotationCommand(domain, modelUri, newEnumeration, position));
   }
}
