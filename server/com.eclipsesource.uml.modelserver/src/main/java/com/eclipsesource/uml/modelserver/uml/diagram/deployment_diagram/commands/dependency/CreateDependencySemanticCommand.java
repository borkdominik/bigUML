package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.dependency;

import java.util.LinkedList;

import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateDependencySemanticCommand
   extends BaseCreateSemanticRelationCommand<Dependency, NamedElement, NamedElement> {

   public CreateDependencySemanticCommand(final ModelContext context,
      final NamedElement source, final NamedElement target) {
      super(context, source, target);
   }

   @Override
   protected Dependency createSemanticElement(final NamedElement source, final NamedElement target) {
      var dependency = source.createDependency(target);

      var list = new LinkedList<>(dependency.getClients());
      list.addAll(dependency.getSuppliers());
      var nameGenerator = new ListNameGenerator(Dependency.class, list);
      dependency.setName(nameGenerator.newName());
      return dependency;
   }

}
