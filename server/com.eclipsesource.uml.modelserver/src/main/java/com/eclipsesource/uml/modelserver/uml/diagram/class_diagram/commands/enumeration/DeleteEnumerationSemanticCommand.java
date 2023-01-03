package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteEnumerationSemanticCommand extends BaseDeleteSemanticChildCommand<Package, Enumeration> {

   public DeleteEnumerationSemanticCommand(final ModelContext context, final Enumeration semanticElement) {
      super(context, semanticElement.getPackage(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final Enumeration child) {
      parent.getPackagedElements().remove(child);
   }
}
