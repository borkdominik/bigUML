package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.package_import;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;

public final class CreatePackageImportCompoundCommand extends CompoundCommand {

   public CreatePackageImportCompoundCommand(final ModelContext context,
      final Package source,
      final Package target) {

      var command = new CreatePackageImportSemanticCommand(context, source,
         target);
      this.append(command);
      this.append(new AddEdgeNotationCommand(context, command::getSemanticElement));
   }
}
