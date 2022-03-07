package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentedge;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemoveDeploymentCommand extends UmlSemanticElementCommand {

    protected final String semanticUriFragment;
    protected final String parentUriFragment;

    public RemoveDeploymentCommand(final EditingDomain domain, final URI modelUri,
                                   final String semanticUriFragment, final String parentUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.parentUriFragment = parentUriFragment;
    }

    @Override
    protected void doExecute() {
        Deployment deploymentToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
                Deployment.class);
        Node parent = UmlSemanticCommandUtil.getElement(umlModel, parentUriFragment,
                Node.class);
        parent.getDeployments().remove(deploymentToRemove);
    }
}
