package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.node;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveNodeCompoundCommand extends CompoundCommand {

    public RemoveNodeCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                     final String parentSemanticUriFragment) {
        this.append(new RemoveNodeCommand(domain, modelUri, semanticUriFragment, parentSemanticUriFragment));
        this.append(new RemoveNodeShapeCommand(domain, modelUri, semanticUriFragment));

        /*Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        Node nodeToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Node.class);*/
    }
}
