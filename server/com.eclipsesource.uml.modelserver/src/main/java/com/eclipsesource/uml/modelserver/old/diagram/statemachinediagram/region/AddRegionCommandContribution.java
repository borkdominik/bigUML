package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.region;

public class AddRegionCommandContribution { /*-{

   public static final String TYPE = "addRegionContribution";
   public static final String PARENT_SEMANTIC_URI_FRAGMENT = "semanticProxyUri";

   public static CCompoundCommand create(final GPoint position, final String parentSemanticUri) {
      CCompoundCommand addRegionCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addRegionCommand.setType(TYPE);
      addRegionCommand.getProperties().put(NotationKeys.POSITION_X,
            String.valueOf(position.getX()));
      addRegionCommand.getProperties().put(NotationKeys.POSITION_Y,
            String.valueOf(position.getY()));
      addRegionCommand.getProperties().put(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT,
            parentSemanticUri);
      return addRegionCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      GPoint regionPosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(NotationKeys.POSITION_X),
            command.getProperties().get(NotationKeys.POSITION_Y));

      String parentSemanticUriFragment = command.getProperties()
            .get(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT);

      return new AddRegionCompoundCommand(domain, modelUri, regionPosition, parentSemanticUriFragment);
   }   */
}
