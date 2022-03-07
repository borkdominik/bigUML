package com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveGeneralizationCompoundCommand extends CompoundCommand {

    public RemoveGeneralizationCompoundCommand(final EditingDomain domain, final URI modelUri,
                                               final String semanticUriFragment) {
        this.append(new RemoveGeneralizationCommand(domain, modelUri, semanticUriFragment));
        this.append(new RemoveGeneralizationEdgeCommand(domain, modelUri, semanticUriFragment));
    }
}
