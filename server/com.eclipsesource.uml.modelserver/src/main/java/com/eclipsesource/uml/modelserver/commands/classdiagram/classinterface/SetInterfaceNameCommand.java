package com.eclipsesource.uml.modelserver.commands.classdiagram.classinterface;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interface;

public class SetInterfaceNameCommand extends UmlSemanticElementCommand {

   protected String semanticUriFragment;
   protected String newName;

   public SetInterfaceNameCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                  final String newName) {
      super(domain, modelUri);
      this.semanticUriFragment = semanticUriFragment;
      this.newName = newName;
   }

   @Override
   protected void doExecute() {
      Interface interfaceToRename = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Interface.class);
      interfaceToRename.setName(newName);
   }
}
