package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentspecification;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;

public class AddDeploymentSpecificationCommand extends UmlSemanticElementCommand {

   protected final DeploymentSpecification newDeploymentSpecification;
   protected final String parentSemanticUriFragment;

   public AddDeploymentSpecificationCommand(final EditingDomain domain, final URI modelUri,
                                            final String parentSemanticUri) {
      super(domain, modelUri);
      this.newDeploymentSpecification = UMLFactory.eINSTANCE.createDeploymentSpecification();
      this.parentSemanticUriFragment = parentSemanticUri;
   }

   @Override
   protected void doExecute() {
      newDeploymentSpecification.setName(UmlSemanticCommandUtil.getNewDeploymentSpecificationName(umlModel));

      EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);
      if (parentObject instanceof Artifact) {
         Artifact parentArtifact = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment,
               Artifact.class);
         parentArtifact.getNestedArtifacts().add(newDeploymentSpecification);
      } else if (parentObject instanceof Device) {
         Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
         parentDevice.getNestedClassifiers().add(newDeploymentSpecification);
      } else if (parentObject instanceof ExecutionEnvironment) {
         ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
               parentSemanticUriFragment, ExecutionEnvironment.class);
         parentExecutionEnvironment.getNestedClassifiers().add(newDeploymentSpecification);
      } else if (parentObject instanceof Node) {
         Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
         parentNode.getNestedClassifiers().add(newDeploymentSpecification);
      } else {
         umlModel.getPackagedElements().add(newDeploymentSpecification);
      }
   }

   public DeploymentSpecification getNewDeploymentSpecification() {
      return newDeploymentSpecification;
   }
}
