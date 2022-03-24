package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentedge;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.UMLFactory;

public class AddDeploymentCommand extends UmlSemanticElementCommand {

    private final Deployment newDeployment;
    protected final Artifact sourceArtifact;
    protected final Node targetNode;

    public AddDeploymentCommand(final EditingDomain domain, final URI modelUri,
                                    final String sourceNodeUriFragment, final String targetNodeUriFragment) {
        super(domain, modelUri);
        this.sourceArtifact = UmlSemanticCommandUtil.getElement(umlModel, sourceNodeUriFragment, Artifact.class);
        this.targetNode = UmlSemanticCommandUtil.getElement(umlModel, targetNodeUriFragment, Node.class);
        this.newDeployment = UMLFactory.eINSTANCE.createDeployment();
        this.newDeployment.getClients().add(targetNode);
        this.newDeployment.getSuppliers().add(sourceArtifact);
        this.newDeployment.getDeployedArtifacts().add(sourceArtifact);
    }

    @Override
    protected void doExecute() {
        /*this.newDeployment.getClients().add(targetNode);
        this.newDeployment.getSuppliers().add(sourceArtifact);
        this.newDeployment.getDeployedArtifacts().add(sourceArtifact);*/
        this.targetNode.getDeployments().add(getNewDeployment());
    }

    public Deployment getNewDeployment() {
        return newDeployment;
    }
}