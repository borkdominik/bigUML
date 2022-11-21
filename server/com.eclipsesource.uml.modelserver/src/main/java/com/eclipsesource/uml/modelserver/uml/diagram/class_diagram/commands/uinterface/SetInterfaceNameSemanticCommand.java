package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interface;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class SetInterfaceNameSemanticCommand extends UmlSemanticElementCommand {

   protected final Interface uinterface;
   protected final String newName;

   public SetInterfaceNameSemanticCommand(final EditingDomain domain, final URI modelUri, final Interface uinterface,
      final String newName) {
      super(domain, modelUri);
      this.uinterface = uinterface;
      this.newName = newName;
   }

   @Override
   protected void doExecute() {
      uinterface.setName(newName);
   }
}
