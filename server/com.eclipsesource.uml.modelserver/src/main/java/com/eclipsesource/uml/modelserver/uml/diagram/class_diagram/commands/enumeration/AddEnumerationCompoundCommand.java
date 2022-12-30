package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlAddShapeCommand;

public final class AddEnumerationCompoundCommand extends CompoundCommand {

   public AddEnumerationCompoundCommand(final ModelContext context, final Package parent, final GPoint position) {
      var command = new AddEnumerationSemanticCommand(context, parent);
      this.append(command);
      this.append(new UmlAddShapeCommand(context, command::getSemanticElement, position, GraphUtil.dimension(160, 50)));
   }
}
