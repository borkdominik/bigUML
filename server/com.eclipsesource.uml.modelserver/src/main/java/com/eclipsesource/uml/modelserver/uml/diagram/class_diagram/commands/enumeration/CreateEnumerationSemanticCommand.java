package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.NameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.PackageableElementNameGenerator;

public final class CreateEnumerationSemanticCommand extends BaseCreateSemanticChildCommand<Package, Enumeration> {

   protected final NameGenerator nameGenerator;

   public CreateEnumerationSemanticCommand(final ModelContext context, final Package parent) {
      super(context, parent);
      this.nameGenerator = new PackageableElementNameGenerator(context, Enumeration.class);
   }

   @Override
   protected Enumeration createSemanticElement(final Package parent) {
      return parent.createOwnedEnumeration(nameGenerator.newName());
   }

}
