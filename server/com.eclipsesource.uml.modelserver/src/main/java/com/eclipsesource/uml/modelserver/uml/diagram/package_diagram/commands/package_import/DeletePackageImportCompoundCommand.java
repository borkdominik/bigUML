package com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_import;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.PackageImport;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.reference.PackageDiagramCrossReferenceRemover;

public final class DeletePackageImportCompoundCommand extends CompoundCommand {

   public DeletePackageImportCompoundCommand(final ModelContext context,
      final PackageImport semanticElement) {
      this.append(new DeletePackageImportSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      new PackageDiagramCrossReferenceRemover(context).deleteCommandsFor(semanticElement)
         .forEach(this::append);
   }

}
