package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.generalization;

public class AddGeneralizationCommandContribution { /*-{

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
   }   */
}
