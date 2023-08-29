package com.eclipsesource.uml.modelserver.uml.elements.dependency.commands;

import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public final class CreateDependencySemanticCommand
   extends BaseCreateSemanticRelationCommand<Dependency, NamedElement, NamedElement> {

   public CreateDependencySemanticCommand(final ModelContext context,
      final NamedElement source, final NamedElement target) {
      super(context, source, target);
   }

   @Override
   protected Dependency createSemanticElement(final NamedElement source, final NamedElement target) {
      return source.createDependency(target);
   }

}
