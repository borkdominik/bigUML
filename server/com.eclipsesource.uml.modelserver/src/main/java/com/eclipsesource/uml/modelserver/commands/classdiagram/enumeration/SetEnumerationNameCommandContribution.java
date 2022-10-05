package com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration;

public class SetEnumerationNameCommandContribution { /*-{

   public static final String TYPE = "setEnumerationName";
   public static final String NEW_NAME = "newName";

   public static CCommand create(final String semanticUri, final String newName) {
      CCommand setEnumerationNameCommand = CCommandFactory.eINSTANCE.createCommand();
      setEnumerationNameCommand.setType(TYPE);
      setEnumerationNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      setEnumerationNameCommand.getProperties().put(NEW_NAME, newName);
      return setEnumerationNameCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      String newName = command.getProperties().get(NEW_NAME);
      return new SetEnumerationNameCommand(domain, modelUri, semanticUriFragment, newName);
   }
      */
}
