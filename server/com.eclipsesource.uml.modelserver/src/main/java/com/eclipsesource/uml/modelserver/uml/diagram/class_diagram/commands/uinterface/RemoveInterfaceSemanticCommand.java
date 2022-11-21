package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interface;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemoveInterfaceSemanticCommand extends UmlSemanticElementCommand {

   protected final Interface interfaceToRemove;

   public RemoveInterfaceSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Interface interfaceToRemove) {
      super(domain, modelUri);
      this.interfaceToRemove = interfaceToRemove;
   }

   @Override
   protected void doExecute() {
      model.getPackagedElements().remove(interfaceToRemove);
   }
}
