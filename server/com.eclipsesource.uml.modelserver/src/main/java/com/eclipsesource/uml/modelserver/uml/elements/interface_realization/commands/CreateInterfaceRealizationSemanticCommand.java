package com.eclipsesource.uml.modelserver.uml.elements.interface_realization.commands;

import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.InterfaceRealization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public final class CreateInterfaceRealizationSemanticCommand
   extends BaseCreateSemanticRelationCommand<InterfaceRealization, Class, Interface> {

   public CreateInterfaceRealizationSemanticCommand(final ModelContext context,
      final Class source, final Interface target) {
      super(context, source, target);
   }

   @Override
   protected InterfaceRealization createSemanticElement(final Class source, final Interface target) {
      return source.createInterfaceRealization(null, target);
   }

}
