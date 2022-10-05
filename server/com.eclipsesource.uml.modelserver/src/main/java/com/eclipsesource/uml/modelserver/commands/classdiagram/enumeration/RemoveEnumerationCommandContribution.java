package com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration;

public class RemoveEnumerationCommandContribution { /*-{

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
   */
}
