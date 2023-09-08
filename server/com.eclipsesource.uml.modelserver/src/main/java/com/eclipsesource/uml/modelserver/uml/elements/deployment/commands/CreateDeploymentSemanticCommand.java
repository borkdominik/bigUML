package com.eclipsesource.uml.modelserver.uml.elements.deployment.commands;

import org.eclipse.uml2.uml.DeployedArtifact;
import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.DeploymentTarget;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateDeploymentSemanticCommand
   extends BaseCreateSemanticRelationCommand<Deployment, DeployedArtifact, DeploymentTarget> {

   public CreateDeploymentSemanticCommand(final ModelContext context,
      final DeployedArtifact source, final DeploymentTarget target) {
      super(context, source, target);
   }

   @Override
   protected Deployment createSemanticElement(final DeployedArtifact source, final DeploymentTarget target) {
      var nameGenerator = new ListNameGenerator(Deployment.class, target.allNamespaces());

      var deployment = target.createDeployment(nameGenerator.newName());
      deployment.getDeployedArtifacts().add(source);

      return deployment;
   }

}
