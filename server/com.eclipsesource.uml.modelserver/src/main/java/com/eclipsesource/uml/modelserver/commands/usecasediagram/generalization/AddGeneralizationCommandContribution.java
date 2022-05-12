package com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class AddGeneralizationCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "addGeneralizationContribution";
   public static final String GENERAL_CLASSIFIER_URI_FRAGMENT = "generalClassifierUriFragment";
   public static final String SPECIFIC_CLASSIFIER_URI_FRAGMENT = "specificClassifierUriFragment";

   public static CCompoundCommand create(final String generalClassifierUri, final String specificClassifierUri) {
      System.out.println("general: " + generalClassifierUri);
      System.out.println("specific: " + specificClassifierUri);
      CCompoundCommand addGeneralizationCompoundCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addGeneralizationCompoundCommand.setType(TYPE);
      addGeneralizationCompoundCommand.getProperties().put(GENERAL_CLASSIFIER_URI_FRAGMENT, generalClassifierUri);
      addGeneralizationCompoundCommand.getProperties().put(SPECIFIC_CLASSIFIER_URI_FRAGMENT, specificClassifierUri);
      return addGeneralizationCompoundCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      String generalClassifierUri = command.getProperties().get(GENERAL_CLASSIFIER_URI_FRAGMENT);
      String specificClassifierUri = command.getProperties().get(SPECIFIC_CLASSIFIER_URI_FRAGMENT);
      System.out.println("general: " + generalClassifierUri);
      System.out.println("specific: " + specificClassifierUri);
      return new AddGeneralizationCompoundCommand(domain, modelUri, generalClassifierUri, specificClassifierUri);
   }
}
