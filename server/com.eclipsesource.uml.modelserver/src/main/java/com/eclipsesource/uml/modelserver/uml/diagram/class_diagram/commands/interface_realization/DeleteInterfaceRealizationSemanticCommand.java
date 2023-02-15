package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.interface_realization;

import org.eclipse.uml2.uml.BehavioredClassifier;
import org.eclipse.uml2.uml.InterfaceRealization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteInterfaceRealizationSemanticCommand
   extends BaseDeleteSemanticChildCommand<BehavioredClassifier, InterfaceRealization> {

   public DeleteInterfaceRealizationSemanticCommand(final ModelContext context,
      final InterfaceRealization semanticElement) {
      super(context, semanticElement.getImplementingClassifier(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final BehavioredClassifier parent, final InterfaceRealization child) {
      parent.getInterfaceRealizations().remove(child);
   }
}
