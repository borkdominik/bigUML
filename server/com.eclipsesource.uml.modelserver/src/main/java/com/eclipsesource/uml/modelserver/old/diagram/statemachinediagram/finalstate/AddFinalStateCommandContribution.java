package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.finalstate;

public class AddFinalStateCommandContribution { /*-{

    public static final String TYPE = "addFinalStateContributuion";
    public static final String PARENT_SEMANTIC_URI_FRAGMENT = "parentSemanticUriFragment";

    public static CCompoundCommand create(final String parentSemanticUri, final GPoint position) {
        CCompoundCommand addFinalStateCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addFinalStateCommand.setType(TYPE);
        addFinalStateCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
                String.valueOf(position.getX()));
        addFinalStateCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
                String.valueOf(position.getY()));
        addFinalStateCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);

        return addFinalStateCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        GPoint finalStatePosition = UmlNotationCommandUtil.getGPoint(
                command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
                command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));
        String parentRegionUriFragment = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);

        return new AddFinalStateCompoundCommand(domain, modelUri, finalStatePosition, parentRegionUriFragment);
    }   */
}
