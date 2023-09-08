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
package com.eclipsesource.uml.modelserver.uml.elements.deployment;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.uml2.uml.DeployedArtifact;
import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.DeploymentTarget;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.deployment.commands.CreateDeploymentSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.deployment.commands.UpdateDeploymentArgument;
import com.eclipsesource.uml.modelserver.uml.elements.deployment.commands.UpdateDeploymentSemanticCommand;

public class DeploymentCommandProvider extends EdgeCommandProvider<Deployment, DeployedArtifact, DeploymentTarget> {
   @Override
   protected Collection<Command> createModifications(final ModelContext context, final DeployedArtifact source,
      final DeploymentTarget target) {
      var semantic = new CreateDeploymentSemanticCommand(context, source,
         target);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final Deployment element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateDeploymentArgument.class);
      return List.of(new UpdateDeploymentSemanticCommand(context, element, update));
   }
}
