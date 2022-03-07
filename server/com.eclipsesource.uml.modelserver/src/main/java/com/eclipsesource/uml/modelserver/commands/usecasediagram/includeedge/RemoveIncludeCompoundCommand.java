package com.eclipsesource.uml.modelserver.commands.usecasediagram.includeedge;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveIncludeCompoundCommand extends CompoundCommand {

    public RemoveIncludeCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        //TODO: add comment edge as in RemveExtendCompoundCommand at later stage
        this.append(new RemoveIncludeCommand(domain, modelUri, semanticUriFragment));
        this.append(new RemoveIncludeEdgeCommand(domain, modelUri, semanticUriFragment));
    }
}
