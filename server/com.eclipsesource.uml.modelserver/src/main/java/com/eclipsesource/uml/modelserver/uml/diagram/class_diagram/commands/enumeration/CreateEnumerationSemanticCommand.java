package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateEnumerationSemanticCommand extends BaseCreateSemanticChildCommand<Package, Enumeration> {

   public CreateEnumerationSemanticCommand(final ModelContext context, final Package parent) {
      super(context, parent);
   }

   @Override
   protected Enumeration createSemanticElement(final Package parent) {
      var nameGenerator = new ListNameGenerator(Enumeration.class, parent.getPackagedElements());

      return parent.createOwnedEnumeration(nameGenerator.newName());
   }

}
