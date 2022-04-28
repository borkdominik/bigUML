package com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class RemoveEnumerationCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "removeEnumeration";

   public static CCompoundCommand create(final String semanticUri) {
      CCompoundCommand removeEnumerationCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      removeEnumerationCommand.setType(TYPE);
      removeEnumerationCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      return removeEnumerationCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {

      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      return new RemoveEnumerationCompoundCommand(domain, modelUri, semanticUriFragment);
   }

}
