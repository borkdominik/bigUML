package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.executionenvironment;

public class AddExecutionEnvironmentCommandContribution { /*-{

   public static final String TYPE = "addExecutionEnvironmentContributuion";
   public static final String PARENT_SEMANTIC_URI_FRAGMENT = "semanticProxyUri";

   public static CCompoundCommand create(final GPoint position, final String parentSemanticUri) {
      CCompoundCommand addExecutionEnvironmentCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addExecutionEnvironmentCommand.setType(TYPE);
      addExecutionEnvironmentCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
            String.valueOf(position.getX()));
      addExecutionEnvironmentCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
            String.valueOf(position.getY()));
      addExecutionEnvironmentCommand.getProperties().put(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT,
            parentSemanticUri);
      return addExecutionEnvironmentCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      GPoint executionEnvironmentPosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
            command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

      String parentSemanticUriFragment = command.getProperties()
            .get(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT);

      return new AddExecutionEnvironmentCompoundCommand(domain, modelUri, executionEnvironmentPosition,
            parentSemanticUriFragment);
   }
   */
}
