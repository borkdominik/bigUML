package com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_merge;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.PackageMerge;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.reference.PackageDiagramCrossReferenceRemover;

public final class DeletePackageMergeCompoundCommand extends CompoundCommand {

   public DeletePackageMergeCompoundCommand(final ModelContext context,
      final PackageMerge semanticElement) {
      this.append(new DeletePackageMergeSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      new PackageDiagramCrossReferenceRemover(context).deleteCommandsFor(semanticElement)
         .forEach(this::append);
   }

}
