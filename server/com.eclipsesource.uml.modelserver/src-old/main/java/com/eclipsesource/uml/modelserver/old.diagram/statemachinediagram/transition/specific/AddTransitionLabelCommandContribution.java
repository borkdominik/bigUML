package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.transition.specific;

public class AddTransitionLabelCommandContribution { /*-{

    public static final String TYPE = "addTransitionLabel";
    public static final String NEW_VALUE = "newValue";

    public static CCommand create(final String semanticUri, final String newValue) {
        CCommand setGuardCommand = CCommandFactory.eINSTANCE.createCommand();
        setGuardCommand.setType(TYPE);
        setGuardCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        setGuardCommand.getProperties().put(NEW_VALUE, newValue);
        return setGuardCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        String newValue = command.getProperties().get(NEW_VALUE);
        return new AddTransitionLabelCommand(domain, modelUri, semanticUriFragment, newValue);
    }   */
}
