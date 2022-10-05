package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.node;

public class AddNodeCommandContribution { /*-{

   public static final String TYPE = "addNodeContributuion";
   public static final String PARENT_SEMANTIC_URI_FRAGMENT = "semanticProxyUri";


   public static CCompoundCommand create(final GPoint position, final String parentSemanticUri) {
      CCompoundCommand addNodeCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addNodeCommand.setType(TYPE);
      addNodeCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
            String.valueOf(position.getX()));
      addNodeCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
            String.valueOf(position.getY()));
      addNodeCommand.getProperties().put(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT,
            parentSemanticUri);

      return addNodeCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      GPoint nodePosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
            command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));
      String parentSemanticUriFragment = command.getProperties()
            .get(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT);

      return new AddNodeCompoundCommand(domain, modelUri, nodePosition, parentSemanticUriFragment);
   }   */
}
