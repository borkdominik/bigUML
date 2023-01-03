package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteInterfaceSemanticCommand extends BaseDeleteSemanticChildCommand<Package, Interface> {

   public DeleteInterfaceSemanticCommand(final ModelContext context, final Interface semanticElement) {
      super(context, semanticElement.getPackage(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final Interface child) {
      parent.getPackagedElements().remove(child);
   }
}
