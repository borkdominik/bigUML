/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.manifest;

import org.eclipse.emfcloud.modelserver.edit.CommandContribution;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.core.manifest.contributions.CommandCodecContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.artifact.CreateArtifactContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.artifact.DeleteArtifactContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.artifact.UpdateArtifactContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.communication_path.CreateCommunicationPathContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.communication_path.DeleteCommunicationPathContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.communication_path.UpdateCommunicationPathContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.dependency.CreateDependencyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.dependency.DeleteDependencyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.dependency.UpdateDependencyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment.CreateDeploymentContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment.DeleteDeploymentContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment.UpdateDeploymentContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment_specification.CreateDeploymentSpecificationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment_specification.DeleteDeploymentSpecificationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment_specification.UpdateDeploymentSpecificationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.device.CreateDeviceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.device.DeleteDeviceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.device.UpdateDeviceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.execution_environment.CreateExecutionEnvironmentContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.execution_environment.DeleteExecutionEnvironmentContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.execution_environment.UpdateExecutionEnvironmentContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.generalization.CreateGeneralizationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.generalization.DeleteGeneralizationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.generalization.UpdateGeneralizationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.manifestation.CreateManifestationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.manifestation.DeleteManifestationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.manifestation.UpdateManifestationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.model.CreateModelContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.model.DeleteModelContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.model.UpdateModelContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.node.CreateNodeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.node.DeleteNodeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.node.UpdateNodeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.operation.CreateOperationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.operation.DeleteOperationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.operation.UpdateOperationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.parameter.CreateParameterContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.parameter.DeleteParameterContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.parameter.UpdateParameterContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.property.CreatePropertyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.property.DeletePropertyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.property.UpdatePropertyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.upackage.CreatePackageContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.upackage.DeletePackageContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.upackage.UpdatePackageContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.multibindings.MapBinder;

public class DeploymentUmlManifest extends DiagramManifest implements CommandCodecContribution {
   public DeploymentUmlManifest() {
      super(Representation.DEPLOYMENT);
   }

   @Override
   protected void configure() {
      super.configure();
      contributeCommandCodec(binder(), this::contributeCommandCodec);
   }

   public void contributeCommandCodec(final MapBinder<String, CommandContribution> multibinder) {

      // Deployment
      multibinder.addBinding(CreateDeploymentSpecificationContribution.TYPE)
         .to(CreateDeploymentSpecificationContribution.class);
      multibinder.addBinding(DeleteDeploymentSpecificationContribution.TYPE)
         .to(DeleteDeploymentSpecificationContribution.class);
      multibinder.addBinding(UpdateDeploymentSpecificationContribution.TYPE)
         .to(UpdateDeploymentSpecificationContribution.class);

      // Artifact
      multibinder.addBinding(CreateArtifactContribution.TYPE).to(CreateArtifactContribution.class);
      multibinder.addBinding(DeleteArtifactContribution.TYPE).to(DeleteArtifactContribution.class);
      multibinder.addBinding(UpdateArtifactContribution.TYPE).to(UpdateArtifactContribution.class);

      // Device
      multibinder.addBinding(CreateDeviceContribution.TYPE).to(CreateDeviceContribution.class);
      multibinder.addBinding(DeleteDeviceContribution.TYPE).to(DeleteDeviceContribution.class);
      multibinder.addBinding(UpdateDeviceContribution.TYPE).to(UpdateDeviceContribution.class);

      // Execution Environment
      multibinder.addBinding(CreateExecutionEnvironmentContribution.TYPE)
         .to(CreateExecutionEnvironmentContribution.class);
      multibinder.addBinding(DeleteExecutionEnvironmentContribution.TYPE)
         .to(DeleteExecutionEnvironmentContribution.class);
      multibinder.addBinding(UpdateExecutionEnvironmentContribution.TYPE)
         .to(UpdateExecutionEnvironmentContribution.class);

      // Model
      multibinder.addBinding(CreateModelContribution.TYPE).to(CreateModelContribution.class);
      multibinder.addBinding(DeleteModelContribution.TYPE).to(DeleteModelContribution.class);
      multibinder.addBinding(UpdateModelContribution.TYPE).to(UpdateModelContribution.class);

      // Node
      multibinder.addBinding(CreateNodeContribution.TYPE).to(CreateNodeContribution.class);
      multibinder.addBinding(DeleteNodeContribution.TYPE).to(DeleteNodeContribution.class);
      multibinder.addBinding(UpdateNodeContribution.TYPE).to(UpdateNodeContribution.class);

      // Package
      multibinder.addBinding(CreatePackageContribution.TYPE).to(CreatePackageContribution.class);
      multibinder.addBinding(DeletePackageContribution.TYPE).to(DeletePackageContribution.class);
      multibinder.addBinding(UpdatePackageContribution.TYPE).to(UpdatePackageContribution.class);

      // Property
      multibinder.addBinding(CreatePropertyContribution.TYPE).to(CreatePropertyContribution.class);
      multibinder.addBinding(DeletePropertyContribution.TYPE).to(DeletePropertyContribution.class);
      multibinder.addBinding(UpdatePropertyContribution.TYPE).to(UpdatePropertyContribution.class);

      // Operation
      multibinder.addBinding(CreateOperationContribution.TYPE).to(CreateOperationContribution.class);
      multibinder.addBinding(DeleteOperationContribution.TYPE).to(DeleteOperationContribution.class);
      multibinder.addBinding(UpdateOperationContribution.TYPE).to(UpdateOperationContribution.class);

      // Parameter
      multibinder.addBinding(CreateParameterContribution.TYPE).to(CreateParameterContribution.class);
      multibinder.addBinding(DeleteParameterContribution.TYPE).to(DeleteParameterContribution.class);
      multibinder.addBinding(UpdateParameterContribution.TYPE).to(UpdateParameterContribution.class);

      // Generalization
      multibinder.addBinding(CreateGeneralizationContribution.TYPE).to(CreateGeneralizationContribution.class);
      multibinder.addBinding(DeleteGeneralizationContribution.TYPE).to(DeleteGeneralizationContribution.class);
      multibinder.addBinding(UpdateGeneralizationContribution.TYPE).to(UpdateGeneralizationContribution.class);

      // Communication Path
      multibinder.addBinding(CreateCommunicationPathContribution.TYPE).to(CreateCommunicationPathContribution.class);
      multibinder.addBinding(DeleteCommunicationPathContribution.TYPE).to(DeleteCommunicationPathContribution.class);
      multibinder.addBinding(UpdateCommunicationPathContribution.TYPE).to(UpdateCommunicationPathContribution.class);

      // Dependency
      multibinder.addBinding(CreateDependencyContribution.TYPE).to(CreateDependencyContribution.class);
      multibinder.addBinding(DeleteDependencyContribution.TYPE).to(DeleteDependencyContribution.class);
      multibinder.addBinding(UpdateDependencyContribution.TYPE).to(UpdateDependencyContribution.class);

      // Deployment
      multibinder.addBinding(CreateDeploymentContribution.TYPE).to(CreateDeploymentContribution.class);
      multibinder.addBinding(DeleteDeploymentContribution.TYPE).to(DeleteDeploymentContribution.class);
      multibinder.addBinding(UpdateDeploymentContribution.TYPE).to(UpdateDeploymentContribution.class);

      // Manifestation
      multibinder.addBinding(CreateManifestationContribution.TYPE).to(CreateManifestationContribution.class);
      multibinder.addBinding(DeleteManifestationContribution.TYPE).to(DeleteManifestationContribution.class);
      multibinder.addBinding(UpdateManifestationContribution.TYPE).to(UpdateManifestationContribution.class);
   }

}
