package com.eclipsesource.uml.modelserver.old.diagram.classdiagram.classinterface;

public class SetInterfaceNameCommandContribution { /*-{

   public static final String TYPE = "setClassName";
   public static final String NEW_NAME = "newName";

   public static CCommand create(final String semanticUri, final String newName) {
      CCommand setInterfaceNameCommand = CCommandFactory.eINSTANCE.createCommand();
      setInterfaceNameCommand.setType(TYPE);
      setInterfaceNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      setInterfaceNameCommand.getProperties().put(NEW_NAME, newName);
      return setInterfaceNameCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      String newName = command.getProperties().get(NEW_NAME);
      return new SetInterfaceNameCommand(domain, modelUri, semanticUriFragment, newName);
   }
      */
}
