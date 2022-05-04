package com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.UMLFactory;

public class AddEnumerationCommand extends UmlSemanticElementCommand {

   protected final Enumeration newEnumeration;

   public AddEnumerationCommand(final EditingDomain domain, final URI modelUri, final Enumeration newEnumeration) {
      super(domain, modelUri);
      this.newEnumeration = newEnumeration;
   }

   public AddEnumerationCommand(final EditingDomain domain, final URI modelUri) {
      this(domain, modelUri, UMLFactory.eINSTANCE.createEnumeration());
   }

   @Override
   protected void doExecute() {
      newEnumeration.setName(UmlSemanticCommandUtil.getNewEnumerationName(umlModel));
      umlModel.getPackagedElements().add(newEnumeration);
   }
}
