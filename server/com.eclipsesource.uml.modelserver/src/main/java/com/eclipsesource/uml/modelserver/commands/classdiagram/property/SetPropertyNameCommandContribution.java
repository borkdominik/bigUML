package com.eclipsesource.uml.modelserver.commands.classdiagram.property;

public class SetPropertyNameCommandContribution { /*-{

   public static final String TYPE = "setPropertyName";
   public static final String NEW_NAME = "newName";

   public static CCommand create(final String semanticUri, final String newName) {
      CCommand setPropertyCommand = CCommandFactory.eINSTANCE.createCommand();
      setPropertyCommand.setType(TYPE);
      setPropertyCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      setPropertyCommand.getProperties().put(NEW_NAME, newName);
      return setPropertyCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {

      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      String newName = command.getProperties().get(NEW_NAME);

      return new SetPropertyNameCommand(domain, modelUri, semanticUriFragment, newName);
   }
   */
}
