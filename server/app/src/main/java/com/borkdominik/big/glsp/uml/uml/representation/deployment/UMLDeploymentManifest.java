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
package com.borkdominik.big.glsp.uml.uml.representation.deployment;

import com.borkdominik.big.glsp.server.core.features.direct_editing.implementations.BGEMFDefaultDirectEditHandler;
import com.borkdominik.big.glsp.server.core.handler.operation.delete.implementations.BGEMFDefaultDeleteHandler;
import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.uml.uml.customizations.UMLDefaultPropertyPaletteProvider;
import com.borkdominik.big.glsp.uml.uml.customizations.UMLDefaultReconnectElementHandler;
import com.borkdominik.big.glsp.uml.uml.elements.artifact.ArtifactElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.communication_path.CommunicationPathElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.dependency.DependencyElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.deployment.DeploymentElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.deployment_specification.DeploymentSpecificationElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.device.DeviceElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.execution_environment.ExecutionEnvironmentElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.generalization.GeneralizationElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.manifestation.ManifestationElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.model.ModelElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.node.NodeElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.operation.OperationElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.package_.PackageElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.parameter.ParameterElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.property.PropertyElementManifest;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public class UMLDeploymentManifest extends BGRepresentationManifest {

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.DEPLOYMENT;
   }

   @Override
   protected void configure() {
      super.configure();

      bindToolPalette(DeploymentToolPaletteProvider.class);
      bindDefaultDeleteOperation(BGEMFDefaultDeleteHandler.class);
      bindDefaultDirectEdit(BGEMFDefaultDirectEditHandler.class);
      bindDefaultReconnectOperation(UMLDefaultReconnectElementHandler.class);
      bindDefaultPropertyPalette(UMLDefaultPropertyPaletteProvider.class);

      install(new ArtifactElementManifest(this));
      install(new DeviceElementManifest(this));
      install(new DeploymentSpecificationElementManifest(this));
      install(new ExecutionEnvironmentElementManifest(this));
      install(new ModelElementManifest(this));
      install(new NodeElementManifest(this));
      install(new PackageElementManifest(this));
      install(new CommunicationPathElementManifest(this));
      install(new DependencyElementManifest(this));
      install(new ManifestationElementManifest(this));
      install(new DeploymentElementManifest(this));
      install(new GeneralizationElementManifest(this));
      install(new ParameterElementManifest(this));
      install(new PropertyElementManifest(this));
      install(new OperationElementManifest(this));
   }
}
