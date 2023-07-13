package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.abstraction;

import org.eclipse.uml2.uml.Abstraction;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public final class CreateAbstractionSemanticCommand
   extends BaseCreateSemanticRelationCommand<Abstraction, NamedElement, NamedElement> {

   public CreateAbstractionSemanticCommand(final ModelContext context,
      final NamedElement source, final NamedElement target) {
      super(context, source, target);
   }

   @Override
   protected Abstraction createSemanticElement(final NamedElement source, final NamedElement target) {
      var abstraction = UMLFactory.eINSTANCE.createAbstraction();

      abstraction.getClients().add(source);
      abstraction.getSuppliers().add(target);

      source.getNearestPackage().getPackagedElements().add(abstraction);

      return abstraction;
   }

}
