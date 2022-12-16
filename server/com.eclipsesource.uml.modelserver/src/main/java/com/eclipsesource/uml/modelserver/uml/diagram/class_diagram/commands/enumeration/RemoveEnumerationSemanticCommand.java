package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.uml2.uml.Enumeration;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemoveEnumerationSemanticCommand extends UmlSemanticElementCommand {

   protected final Enumeration enumerationToRemove;

   public RemoveEnumerationSemanticCommand(final ModelContext context,
      final Enumeration enumerationToRemove) {
      super(context);
      this.enumerationToRemove = enumerationToRemove;
   }

   @Override
   protected void doExecute() {
      model.getPackagedElements().remove(enumerationToRemove);
   }

}
