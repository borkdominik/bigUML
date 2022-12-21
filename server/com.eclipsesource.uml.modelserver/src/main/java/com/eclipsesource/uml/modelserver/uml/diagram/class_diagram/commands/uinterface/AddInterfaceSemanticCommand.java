package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.CreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.NameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.PackageableElementNameGenerator;

public class AddInterfaceSemanticCommand extends CreateSemanticChildCommand<Package, Interface> {

   protected final NameGenerator nameGenerator;

   public AddInterfaceSemanticCommand(final ModelContext context, final Package parent) {
      super(context, parent);
      this.nameGenerator = new PackageableElementNameGenerator(context, Interface.class);
   }

   @Override
   protected Interface createSemanticElement(final Package parent) {
      return this.parent.createOwnedInterface(nameGenerator.newName());
   }

}
