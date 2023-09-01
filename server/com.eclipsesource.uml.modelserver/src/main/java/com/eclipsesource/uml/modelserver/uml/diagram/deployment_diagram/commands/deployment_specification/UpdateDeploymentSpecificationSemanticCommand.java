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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment_specification;

import org.eclipse.uml2.uml.DeploymentSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

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

      updateArgument.name().ifPresent(arg -> {
         semanticElement.setName(arg);
      });

      updateArgument.fileName().ifPresent(arg -> {
         semanticElement.setFileName(arg);
      });

      updateArgument.executionLocation().ifPresent(arg -> {
         semanticElement.setExecutionLocation(arg);
      });

      updateArgument.deploymentLocation().ifPresent(arg -> {
         semanticElement.setDeploymentLocation(arg);
      });

      updateArgument.isAbstract().ifPresent(arg -> {
         semanticElement.setIsAbstract(arg);
      });

      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
      });

      updateArgument.label().ifPresent(arg -> {
         throw new UnsupportedOperationException();
      });

   }

}
