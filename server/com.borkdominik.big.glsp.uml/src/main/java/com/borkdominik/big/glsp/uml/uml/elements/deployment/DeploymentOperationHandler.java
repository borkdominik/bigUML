/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.deployment;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.DeployedArtifact;
import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.DeploymentTarget;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFEdgeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateEdgeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class DeploymentOperationHandler
   extends BGEMFEdgeOperationHandler<Deployment, DeployedArtifact, DeploymentTarget> {

   @Inject
   public DeploymentOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateSemanticCommand<Deployment> createSemanticCommand(
      final CreateEdgeOperation operation, final DeployedArtifact source, final DeploymentTarget target) {
      var argument = UMLCreateEdgeCommand.Argument
         .<Deployment, DeployedArtifact, DeploymentTarget> createEdgeArgumentBuilder()
         .supplier((s, t) -> {
            var deployment = t.createDeployment(null);
            deployment.getDeployedArtifacts().add(source);
            return deployment;
         })
         .build();

      return new UMLCreateEdgeCommand<>(commandContext, source, target, argument);
   }

}
