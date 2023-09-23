package com.eclipsesource.uml.modelserver.uml.elements.interface_.commands;

import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateInterfaceSemanticCommand extends BaseCreateSemanticChildCommand<Package, Interface> {

   public CreateInterfaceSemanticCommand(final ModelContext context, final Package parent) {
      super(context, parent);
   }

   @Override
   protected Interface createSemanticElement(final Package parent) {
      var nameGenerator = new ListNameGenerator(Interface.class, parent.getPackagedElements());

      return this.parent.createOwnedInterface(nameGenerator.newName());
   }

}
