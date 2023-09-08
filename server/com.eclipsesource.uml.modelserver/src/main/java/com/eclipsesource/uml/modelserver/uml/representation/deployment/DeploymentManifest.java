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
package com.eclipsesource.uml.modelserver.uml.representation.deployment;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.uml.elements.artifact.ArtifactDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.communication_path.CommunicationPathDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.dependency.DependencyDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.deployment.DeploymentDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.device.DeviceDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.execution_environment.ExecutionEnvironmentDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.generalization.GeneralizationDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.manifestation.ManifestationDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.model.ModelDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.node.NodeDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.package_.PackageDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.property.PropertyDefinitionModule;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class DeploymentManifest extends DiagramManifest {
   public DeploymentManifest() {
      super(Representation.DEPLOYMENT);
   }

   @Override
   protected void configure() {
      super.configure();

      install(new DeploymentDefinitionModule(this));
      install(new ArtifactDefinitionModule(this));
      install(new DeviceDefinitionModule(this));
      install(new ExecutionEnvironmentDefinitionModule(this));
      install(new ModelDefinitionModule(this));
      install(new NodeDefinitionModule(this));
      install(new PackageDefinitionModule(this));
      install(new PropertyDefinitionModule(this));
      install(new PackageDefinitionModule(this));
      install(new GeneralizationDefinitionModule(this));
      install(new CommunicationPathDefinitionModule(this));
      install(new DependencyDefinitionModule(this));
      install(new DeploymentDefinitionModule(this));
      install(new ManifestationDefinitionModule(this));
      install(new PackageDefinitionModule(this));
      install(new PackageDefinitionModule(this));
   }

}
