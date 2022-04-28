package com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Enumeration;

public class RemoveEnumerationCommand extends UmlSemanticElementCommand {

   protected final String semanticUriFragment;

   public RemoveEnumerationCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
      super(domain, modelUri);
      this.semanticUriFragment = semanticUriFragment;
   }

   @Override
   protected void doExecute() {
      Enumeration enumerationToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Enumeration.class);
      umlModel.getPackagedElements().remove(enumerationToRemove);
   }
}
