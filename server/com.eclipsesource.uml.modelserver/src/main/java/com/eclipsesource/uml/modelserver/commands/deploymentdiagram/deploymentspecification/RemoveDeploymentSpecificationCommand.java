package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentspecification;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.DeploymentSpecification;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.Node;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemoveDeploymentSpecificationCommand extends UmlSemanticElementCommand {

    protected final String semanticUriFragment;
    protected final String parentSemanticUriFragment;

    public RemoveDeploymentSpecificationCommand(final EditingDomain domain, final URI modelUri,
                                                final String semanticUriFragment, final String parentSemanticUri) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.parentSemanticUriFragment = parentSemanticUri;
    }

    @Override
    protected void doExecute() {
        DeploymentSpecification deploymentSpecificationToRemove = UmlSemanticCommandUtil.getElement(umlModel,
                semanticUriFragment, DeploymentSpecification.class);
        EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);

        if (parentObject instanceof Artifact) {
            Artifact parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Artifact.class);
            parentNode.getNestedArtifacts().remove(deploymentSpecificationToRemove);
        } else if (parentObject instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedClassifiers().remove(deploymentSpecificationToRemove);
        } else if (parentObject instanceof ExecutionEnvironment) {
            ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
                    parentSemanticUriFragment, ExecutionEnvironment.class);
            parentExecutionEnvironment.getNestedClassifiers().remove(deploymentSpecificationToRemove);
        } else if (parentObject instanceof Node) {
            Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
            parentNode.getNestedClassifiers().remove(deploymentSpecificationToRemove);
        } else {
            umlModel.getPackagedElements().remove(deploymentSpecificationToRemove);
        }
    }
}