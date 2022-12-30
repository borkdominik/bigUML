package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.NameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.PackageableElementNameGenerator;

public final class CreateInterfaceSemanticCommand extends BaseCreateSemanticChildCommand<Package, Interface> {

   protected final NameGenerator nameGenerator;

   public CreateInterfaceSemanticCommand(final ModelContext context, final Package parent) {
      super(context, parent);
      this.nameGenerator = new PackageableElementNameGenerator(context, Interface.class);
   }

   @Override
   protected Interface createSemanticElement(final Package parent) {
      return this.parent.createOwnedInterface(nameGenerator.newName());
   }

}
