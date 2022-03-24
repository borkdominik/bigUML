package com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution;
import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class AddBehaviorToStateCommandContribution extends UmlSemanticCommandContribution {

    public static final String TYPE = "addBehaviorToState";
    public static final String ACTIVITY_TYPE = "activityType";

    public static CCommand create(final String parentSemanticUri, final String activityType) {
        CCommand addBehaviorToStateCommand = CCommandFactory.eINSTANCE.createCommand();
        addBehaviorToStateCommand.setType(TYPE);
        addBehaviorToStateCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
        addBehaviorToStateCommand.getProperties().put(ACTIVITY_TYPE, activityType);
        return addBehaviorToStateCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String parentSemanticUriFragment = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
        String activityType = command.getProperties().get(ACTIVITY_TYPE);

        return new AddBehaviorToStateCommand(domain, modelUri, parentSemanticUriFragment, activityType);
    }

}
