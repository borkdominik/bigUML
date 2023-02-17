package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.package_merge;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.PackageMerge;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;

public final class DeletePackageMergeCompoundCommand extends CompoundCommand {

   public DeletePackageMergeCompoundCommand(final ModelContext context,
      final PackageMerge semanticElement) {
      this.append(new DeletePackageMergeSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

   }

}
