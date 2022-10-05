package com.eclipsesource.uml.modelserver.commands.classdiagram.classinterface;

public class RemoveInterfaceCommandContribution { /*-{

   public static final String TYPE = "removeInterface";

   public static CCompoundCommand create(final String semanticUri) {
      CCompoundCommand removeInterfaceCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      removeInterfaceCommand.setType(TYPE);
      removeInterfaceCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      return removeInterfaceCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      return new RemoveInterfaceCompoundCommand(domain, modelUri, semanticUriFragment);
   }
      */
}
