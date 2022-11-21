package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property;

public class SetPropertyTypeContribution { /*-{

   public static final String TYPE = "setPropertyType";
   public static final String NEW_TYPE = "newType";

   public static CCommand create(final String semanticUri, final String newType) {
      CCommand setPropertyCommand = CCommandFactory.eINSTANCE.createCommand();
      setPropertyCommand.setType(TYPE);
      setPropertyCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      setPropertyCommand.getProperties().put(NEW_TYPE, newType);
      return setPropertyCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {

      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      Type newType = UmlSemanticCommandUtil.getType(domain, command.getProperties().get(NEW_TYPE));

      return new SetPropertyTypeCommand(domain, modelUri, semanticUriFragment, newType);
   }
   */
}
