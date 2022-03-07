package com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveTransitionEdgeCommand extends UmlNotationElementCommand {

    protected final Edge edgeToRemove;

    public RemoveTransitionEdgeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
        super(domain, modelUri);
        edgeToRemove = UmlNotationCommandUtil.getNotationElement(modelUri, domain, semanticProxyUri, Edge.class);
    }

    @Override
    protected void doExecute() {
        if (edgeToRemove != null) {
            umlDiagram.getElements().remove(edgeToRemove);
        }
    }
}
