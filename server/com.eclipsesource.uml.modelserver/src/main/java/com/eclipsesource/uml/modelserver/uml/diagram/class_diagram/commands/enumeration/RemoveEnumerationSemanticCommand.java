package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.DeleteSemanticChildCommand;

public class RemoveEnumerationSemanticCommand extends DeleteSemanticChildCommand<Package, Enumeration> {

   public RemoveEnumerationSemanticCommand(final ModelContext context,
      final Package parent, final Enumeration semanticElement) {
      super(context, parent, semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final Enumeration child) {
      parent.getPackagedElements().remove(child);
   }
}
