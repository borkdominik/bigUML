package com.eclipsesource.uml.modelserver.commands.classdiagram.generalization;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class AddClassGeneralizationCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "addGeneralizationContribution";
   public static final String GENERAL_CLASS_URI_FRAGMENT = "generalClassUriFragment";
   public static final String SPECIFIC_CLASS_URI_FRAGMENT = "specificClassUriFragment";

   public static CCompoundCommand create(final String generalClassUri, final String specificClassUri) {
      System.out.println("ENTERED COMMAND CONTRIBUTION!!!!");
      CCompoundCommand addClassGeneralizationCompoundCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addClassGeneralizationCompoundCommand.setType(TYPE);
      addClassGeneralizationCompoundCommand.getProperties().put(GENERAL_CLASS_URI_FRAGMENT, generalClassUri);
      addClassGeneralizationCompoundCommand.getProperties().put(SPECIFIC_CLASS_URI_FRAGMENT, specificClassUri);
      return addClassGeneralizationCompoundCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      String generalClassUri = command.getProperties().get(GENERAL_CLASS_URI_FRAGMENT);
      String specificClassUri = command.getProperties().get(SPECIFIC_CLASS_URI_FRAGMENT);
      return new AddClassGeneralizationCompoundCommand(domain, modelUri, generalClassUri, specificClassUri);
   }
}
