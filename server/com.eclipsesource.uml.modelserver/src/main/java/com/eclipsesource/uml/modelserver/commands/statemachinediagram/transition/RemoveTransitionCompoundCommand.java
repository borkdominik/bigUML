package com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveTransitionCompoundCommand extends CompoundCommand {

    public RemoveTransitionCompoundCommand(final EditingDomain domain, final URI modelUri,
                                           final String parentSemanticUriFragment, final String transitionSemanticUriFragment) {
        this.append(
                new RemoveTransitionCommand(domain, modelUri, parentSemanticUriFragment, transitionSemanticUriFragment));
        this.append(new RemoveTransitionEdgeCommand(domain, modelUri, transitionSemanticUriFragment));
    }
}
