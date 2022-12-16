package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemoveGeneralizationSemanticCommand extends UmlSemanticElementCommand {

   protected final Generalization generalization;

   public RemoveGeneralizationSemanticCommand(final ModelContext context,
      final Generalization generalization) {
      super(context);
      this.generalization = generalization;
   }

   @Override
   protected void doExecute() {
      var classifier = generalization.getSpecific();
      classifier.getGeneralizations().remove(generalization);
   }

}
