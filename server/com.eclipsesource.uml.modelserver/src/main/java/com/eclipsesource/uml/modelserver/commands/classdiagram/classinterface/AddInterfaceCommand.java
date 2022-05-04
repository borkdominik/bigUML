package com.eclipsesource.uml.modelserver.commands.classdiagram.classinterface;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.UMLFactory;

public class AddInterfaceCommand extends UmlSemanticElementCommand {

   protected final Interface newInterface;

   public AddInterfaceCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.newInterface = UMLFactory.eINSTANCE.createInterface();
   }

   @Override
   protected void doExecute() {
      newInterface.setName(UmlSemanticCommandUtil.getNewPackageableElementName(umlModel, Interface.class));
      umlModel.getPackagedElements().add(newInterface);
   }

   public Interface getNewInterface() {
      return newInterface;
   }
}
