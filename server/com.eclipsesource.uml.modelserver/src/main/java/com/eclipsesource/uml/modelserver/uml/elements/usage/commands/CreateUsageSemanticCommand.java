package com.eclipsesource.uml.modelserver.uml.elements.usage.commands;

import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Usage;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public final class CreateUsageSemanticCommand
   extends BaseCreateSemanticRelationCommand<Usage, NamedElement, NamedElement> {

   public CreateUsageSemanticCommand(final ModelContext context,
      final NamedElement source, final NamedElement target) {
      super(context, source, target);
   }

   @Override
   protected Usage createSemanticElement(final NamedElement source, final NamedElement target) {
      return source.createUsage(target);
   }

}
