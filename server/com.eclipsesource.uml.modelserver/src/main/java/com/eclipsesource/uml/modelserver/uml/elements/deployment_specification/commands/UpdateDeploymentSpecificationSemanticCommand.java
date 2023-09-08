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
package com.eclipsesource.uml.modelserver.uml.elements.deployment_specification.commands;

import java.util.List;

import org.eclipse.uml2.uml.DeploymentSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.artifact.commands.UpdateArtifactSemanticCommand;

public final class UpdateDeploymentSpecificationSemanticCommand
   extends BaseUpdateSemanticElementCommand<DeploymentSpecification, UpdateDeploymentSpecificationArgument> {

   public UpdateDeploymentSpecificationSemanticCommand(final ModelContext context,
      final DeploymentSpecification semanticElement,
      final UpdateDeploymentSpecificationArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final DeploymentSpecification semanticElement,
      final UpdateDeploymentSpecificationArgument updateArgument) {
      include(List.of(new UpdateArtifactSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.executionLocation().ifPresent(arg -> {
         semanticElement.setExecutionLocation(arg);
      });

      updateArgument.deploymentLocation().ifPresent(arg -> {
         semanticElement.setDeploymentLocation(arg);
      });

   }

}
