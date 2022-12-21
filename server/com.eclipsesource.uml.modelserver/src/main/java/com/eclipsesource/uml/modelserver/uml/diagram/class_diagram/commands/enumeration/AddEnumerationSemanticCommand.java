package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.CreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.NameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.PackageableElementNameGenerator;

public class AddEnumerationSemanticCommand extends CreateSemanticChildCommand<Package, Enumeration> {

   protected final NameGenerator nameGenerator;

   public AddEnumerationSemanticCommand(final ModelContext context, final Package parent) {
      super(context, parent);
      this.nameGenerator = new PackageableElementNameGenerator(context, Enumeration.class);
   }

   @Override
   protected Enumeration createSemanticElement(final Package parent) {
      return parent.createOwnedEnumeration(nameGenerator.newName());
   }

}
