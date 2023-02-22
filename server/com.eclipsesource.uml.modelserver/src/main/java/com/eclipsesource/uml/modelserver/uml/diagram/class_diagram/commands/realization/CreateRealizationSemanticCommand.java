package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.realization;

import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Realization;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public final class CreateRealizationSemanticCommand
   extends BaseCreateSemanticRelationCommand<Realization, NamedElement, NamedElement> {

   public CreateRealizationSemanticCommand(final ModelContext context,
      final NamedElement source, final NamedElement target) {
      super(context, source, target);
   }

   @Override
   protected Realization createSemanticElement(final NamedElement source, final NamedElement target) {
      var realization = UMLFactory.eINSTANCE.createRealization();

      realization.getClients().add(source);
      realization.getSuppliers().add(target);

      this.context.model.getPackagedElements().add(realization);

      return realization;
   }

}
