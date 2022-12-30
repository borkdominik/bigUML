package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.DeleteSemanticChildCommand;

public final class RemoveInterfaceSemanticCommand extends DeleteSemanticChildCommand<Package, Interface> {
   public RemoveInterfaceSemanticCommand(final ModelContext context,
      final Package parent,
      final Interface semanticElement) {
      super(context, parent, semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final Interface child) {
      parent.getPackagedElements().remove(child);
   }
}
