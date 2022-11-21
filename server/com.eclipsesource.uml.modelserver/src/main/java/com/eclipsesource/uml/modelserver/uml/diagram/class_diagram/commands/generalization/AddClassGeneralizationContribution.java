package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

public class AddClassGeneralizationContribution { /*-{

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
      */
}
