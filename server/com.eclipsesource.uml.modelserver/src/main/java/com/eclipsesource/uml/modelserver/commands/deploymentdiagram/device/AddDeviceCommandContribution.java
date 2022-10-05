package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.device;

public class AddDeviceCommandContribution { /*-{

   public static final String TYPE = "addDeviceContribution";
   public static final String PARENT_SEMANTIC_URI_FRAGMENT = "semanticProxyUri";

   public static CCompoundCommand create(final GPoint position, final String parentSemanticUri) {
      CCompoundCommand addDeviceCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addDeviceCommand.setType(TYPE);
      addDeviceCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
            String.valueOf(position.getX()));
      addDeviceCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
            String.valueOf(position.getY()));
      addDeviceCommand.getProperties().put(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT,
            parentSemanticUri);
      return addDeviceCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      GPoint devicePosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
            command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

      String parentSemanticUriFragment = command.getProperties()
            .get(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT);

      return new AddDeviceCompoundCommand(domain, modelUri, devicePosition, parentSemanticUriFragment);
   }   */

}
