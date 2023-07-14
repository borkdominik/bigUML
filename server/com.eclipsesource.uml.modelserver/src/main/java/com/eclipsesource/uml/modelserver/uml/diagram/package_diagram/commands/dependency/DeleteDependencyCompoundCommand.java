package com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.dependency;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Dependency;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.reference.PackageDiagramCrossReferenceRemover;

public final class DeleteDependencyCompoundCommand extends CompoundCommand {

   public DeleteDependencyCompoundCommand(final ModelContext context, final Dependency semanticElement) {
      this.append(new DeleteDependencySemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      new PackageDiagramCrossReferenceRemover(context).deleteCommandsFor(semanticElement)
         .forEach(this::append);
   }

}
