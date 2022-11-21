package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;

import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlAddShapeCommand;

public class AddEnumerationCompoundCommand extends CompoundCommand {

   public AddEnumerationCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      var command = new AddEnumerationSemanticCommand(domain, modelUri);
      this.append(command);
      this.append(new UmlAddShapeCommand(domain, modelUri, position, GraphUtil.dimension(160, 50),
         () -> command.getNewEnumeration()));
   }
}
