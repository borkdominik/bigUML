package com.eclipsesource.uml.modelserver.commands.usecasediagram.actor;

public class AddActorCommandContribution { /*-{

   public static final String TYPE = "addActorContribution";

   public static CCompoundCommand create(final GPoint position) {
      CCompoundCommand addActorCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addActorCommand.setType(TYPE);
      addActorCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X, String.valueOf(position.getX()));
      addActorCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y, String.valueOf(position.getY()));
      return addActorCommand;
   }

   public static CCompoundCommand create(final GPoint position, final String parentSemanticUri) {
      CCompoundCommand addActorCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addActorCommand.setType(TYPE);
      addActorCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X, String.valueOf(position.getX()));
      addActorCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y, String.valueOf(position.getY()));
      addActorCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
      return addActorCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {

      GPoint actorPosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
            command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));
      if (command.getProperties().containsKey(PARENT_SEMANTIC_URI_FRAGMENT)) {
         String parentUri = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
         return new AddActorCompoundCommand(domain, modelUri, actorPosition, parentUri);
      }
      return new AddActorCompoundCommand(domain, modelUri, actorPosition);
   }   */
}
