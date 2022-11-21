package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

public class AddEnumerationContribution { /*-{

   public static final String TYPE = "addEnumerationContribution";

   public static CCompoundCommand create(final GPoint position) {
      CCompoundCommand addEnumerationCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addEnumerationCommand.setType(TYPE);
      addEnumerationCommand.getProperties().put(NotationKeys.POSITION_X, String.valueOf(position.getX()));
      addEnumerationCommand.getProperties().put(NotationKeys.POSITION_Y, String.valueOf(position.getY()));
      return addEnumerationCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      GPoint enumerationPosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(NotationKeys.POSITION_X),
            command.getProperties().get(NotationKeys.POSITION_Y));

      return new AddEnumerationCompoundCommand(domain, modelUri, enumerationPosition);
   }
      */
}
