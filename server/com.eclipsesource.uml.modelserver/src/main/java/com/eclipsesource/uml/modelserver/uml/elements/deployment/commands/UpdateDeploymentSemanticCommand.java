/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.elements.deployment.commands;

import java.util.List;

import org.eclipse.uml2.uml.DeployedArtifact;
import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.DeploymentTarget;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementSemanticCommand;

public final class UpdateDeploymentSemanticCommand
   extends BaseUpdateSemanticElementCommand<Deployment, UpdateDeploymentArgument> {

   public UpdateDeploymentSemanticCommand(final ModelContext context, final Deployment semanticElement,
      final UpdateDeploymentArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Deployment semanticElement,
      final UpdateDeploymentArgument updateArgument) {
      include(List.of(new UpdateNamedElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.clientIds().ifPresent(arg -> {
         semanticElement.getClients().clear();
         semanticElement.setLocation(semanticElementAccessor.getElements(arg, DeploymentTarget.class).get(0));
      });

      updateArgument.supplierIds().ifPresent(arg -> {
         semanticElement.getSuppliers().clear();
         semanticElement.getDeployedArtifacts().clear();
         semanticElement.getDeployedArtifacts()
            .addAll(semanticElementAccessor.getElements(arg, DeployedArtifact.class));
      });
   }

}
