package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.usecasepackage;

public class AddPackageCommandContribution { /*-{

   public static final String TYPE = "addPackageContribution";
   public static final String PARENT_SEMANTIC_PROXY_URI = "semanticProxyUri";

   public static CCompoundCommand create(final String parentSemanticUri, final GPoint position) {
      CCompoundCommand addPackageCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addPackageCommand.setType(TYPE);
      addPackageCommand.getProperties().put(PARENT_SEMANTIC_PROXY_URI, parentSemanticUri);
      addPackageCommand.getProperties().put(NotationKeys.POSITION_X, String.valueOf(position.getX()));
      addPackageCommand.getProperties().put(NotationKeys.POSITION_Y, String.valueOf(position.getY()));
      return addPackageCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {

      String parentSemanticUri = command.getProperties().get(PARENT_SEMANTIC_PROXY_URI);
      GPoint packagePosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(NotationKeys.POSITION_X),
            command.getProperties().get(NotationKeys.POSITION_Y));

      return new AddPackageCompoundCommand(domain, modelUri, packagePosition, parentSemanticUri);
   }   */
}
