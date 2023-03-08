package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.component;

public class AddDeploymentComponentCommandContribution { /*-{

   public static final String TYPE = "addComponentContribution";
   public static final String PARENT_URI = "parentUri";

   public static CCompoundCommand create(final GPoint position, final String parentUri) {
      CCompoundCommand addComponentCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addComponentCommand.setType(TYPE);
      addComponentCommand.getProperties().put(NotationKeys.POSITION_X,
            String.valueOf(position.getX()));
      addComponentCommand.getProperties().put(NotationKeys.POSITION_Y,
            String.valueOf(position.getY()));
      addComponentCommand.getProperties().put(PARENT_URI, parentUri);
      return addComponentCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      GPoint position = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(NotationKeys.POSITION_X),
            command.getProperties().get(NotationKeys.POSITION_Y));

      String parentUri = command.getProperties().get(PARENT_URI);

      return new AddComponentCompoundCommand(domain, modelUri, position, parentUri);
   }
      */
}
