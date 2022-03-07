package com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution;
import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class RemoveBehaviorFromStateCommandContribution extends UmlSemanticCommandContribution {

    public static final String TYPE = "removeBehaviorFromState";

    public static CCommand create(final String parentSemanticUri, final String semanticUri) {
        CCommand removePropertyCommand = CCommandFactory.eINSTANCE.createCommand();
        removePropertyCommand.setType(TYPE);
        removePropertyCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
        removePropertyCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        return removePropertyCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        String parentSemanticUri = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
        String semanticUri = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveBehaviorFromStateCommand(domain, modelUri, parentSemanticUri, semanticUri);
    }

}