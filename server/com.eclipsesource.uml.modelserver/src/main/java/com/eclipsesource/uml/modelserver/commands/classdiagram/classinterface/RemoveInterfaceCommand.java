package com.eclipsesource.uml.modelserver.commands.classdiagram.classinterface;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interface;

public class RemoveInterfaceCommand extends UmlSemanticElementCommand {

   protected final String semanticUriFragment;

   public RemoveInterfaceCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
      super(domain, modelUri);
      this.semanticUriFragment = semanticUriFragment;
   }

   @Override
   protected void doExecute() {
      Interface interfaceToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Interface.class);
      umlModel.getPackagedElements().remove(interfaceToRemove);
   }
}
