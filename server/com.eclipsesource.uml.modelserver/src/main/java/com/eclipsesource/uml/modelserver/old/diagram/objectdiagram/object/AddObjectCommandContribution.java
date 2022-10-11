package com.eclipsesource.uml.modelserver.old.diagram.objectdiagram.object;

public class AddObjectCommandContribution { /*-{

    public static final String TYPE = "addObjectContribution";

    public static CCompoundCommand create(final GPoint position) {
        CCompoundCommand addObjectCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addObjectCommand.setType(TYPE);
        addObjectCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X, String.valueOf(position.getX()));
        addObjectCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y, String.valueOf(position.getY()));
        return addObjectCommand;
    }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
           throws DecodingException {
        GPoint objectPosition = UmlNotationCommandUtil.getGPoint(
                command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
                command.getProperties().get(UmlNotationCommandContribution.POSITION_Y)
        );
        return new AddObjectCompoundCommand(domain, modelUri, objectPosition);
   }   */
}
