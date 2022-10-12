package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.component;

public class AddComponentCommandContribution { /*-{

   public static final String TYPE = "addComponentContribution";
   public static final String PARENT_SEMANTIC_PROXY_URI = "semanticProxyUri";

   public static CCompoundCommand create(final String parentSemanticUri, final GPoint position) {
      CCompoundCommand addComponentCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addComponentCommand.setType(TYPE);
      addComponentCommand.getProperties().put(PARENT_SEMANTIC_PROXY_URI, parentSemanticUri);
      addComponentCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X, String.valueOf(position.getX()));
      addComponentCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y, String.valueOf(position.getY()));
      return addComponentCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      String parentSemanticUri = command.getProperties().get(PARENT_SEMANTIC_PROXY_URI);
      GPoint componentPosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
            command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));
      return new AddComponentCompoundCommand(domain, modelUri, componentPosition, parentSemanticUri);
   }   */
}
