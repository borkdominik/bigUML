package com.eclipsesource.uml.modelserver.commands.usecasediagram.extendedge;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveExtendCompoundCommand extends CompoundCommand {

    public RemoveExtendCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        //TODO: add later with comments again
        /*for (RemoveCommentEdgeCommand c : UmlCommentEdgeRemoveUtil.removeIncomingCommentEdge(modelUri, domain,
                semanticUriFragment)) {
            this.append(c);
        }*/
        this.append(new RemoveExtendCommand(domain, modelUri, semanticUriFragment));
        this.append(new RemoveExtendEdgeCommand(domain, modelUri, semanticUriFragment));
    }
}
