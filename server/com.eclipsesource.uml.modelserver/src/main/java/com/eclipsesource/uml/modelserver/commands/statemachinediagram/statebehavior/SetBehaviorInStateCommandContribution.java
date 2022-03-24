package com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution;
import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class SetBehaviorInStateCommandContribution extends UmlSemanticCommandContribution {

    public static final String TYPE = "setBehaviorInState";
    public static final String NEW_NAME = "newName";
    public static final String BEHAVIOR_TYPE = "behaviorType";

    public static CCommand create(final String semanticUri, final String behaviorType, final String newName) {
        CCommand setPropertyCommand = CCommandFactory.eINSTANCE.createCommand();
        setPropertyCommand.setType(TYPE);
        setPropertyCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        setPropertyCommand.getProperties().put(BEHAVIOR_TYPE, behaviorType);
        setPropertyCommand.getProperties().put(NEW_NAME, newName);
        return setPropertyCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        String behaviorType = command.getProperties().get(BEHAVIOR_TYPE);
        String newName = command.getProperties().get(NEW_NAME);

        return new SetBehaviorInStateCommand(domain, modelUri, semanticUriFragment, behaviorType, newName);
    }

}
