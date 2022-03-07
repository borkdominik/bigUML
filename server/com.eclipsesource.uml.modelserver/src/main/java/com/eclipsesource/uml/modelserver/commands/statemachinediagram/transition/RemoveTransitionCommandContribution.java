package com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution;
import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class RemoveTransitionCommandContribution extends UmlSemanticCommandContribution {

    public static final String TYPE = "removeTransition";

    public static CCommand create(final String parentSemanticUri, final String semanticUri) {
        CCommand removeTransitionCommand = CCommandFactory.eINSTANCE.createCommand();
        removeTransitionCommand.setType(TYPE);
        removeTransitionCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
        removeTransitionCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);

        return removeTransitionCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        String parentSemanticUri = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
        String semanticUri = command.getProperties().get(SEMANTIC_URI_FRAGMENT);

        return new RemoveTransitionCompoundCommand(domain, modelUri, parentSemanticUri, semanticUri);
    }
}
