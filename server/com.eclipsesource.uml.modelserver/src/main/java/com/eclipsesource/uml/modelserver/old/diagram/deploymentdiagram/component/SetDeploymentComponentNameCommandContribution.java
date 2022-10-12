package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.component;

public class SetDeploymentComponentNameCommandContribution { /*-{

   public static final String TYPE = "setComponentName";
   public static final String NEW_NAME = "newName";

   public static CCommand create(final String semanticUri, final String newName) {
      CCommand setComponentNameCommand = CCommandFactory.eINSTANCE.createCommand();
      setComponentNameCommand.setType(TYPE);
      setComponentNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      setComponentNameCommand.getProperties().put(NEW_NAME, newName);
      return setComponentNameCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      String newName = command.getProperties().get(NEW_NAME);
      return new SetNameCommand(domain, modelUri, semanticUriFragment, newName);
   }
      */
}
