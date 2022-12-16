package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.uml2.uml.Interface;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemoveInterfaceSemanticCommand extends UmlSemanticElementCommand {

   protected final Interface interfaceToRemove;

   public RemoveInterfaceSemanticCommand(final ModelContext context,
      final Interface interfaceToRemove) {
      super(context);
      this.interfaceToRemove = interfaceToRemove;
   }

   @Override
   protected void doExecute() {
      model.getPackagedElements().remove(interfaceToRemove);
   }
}
