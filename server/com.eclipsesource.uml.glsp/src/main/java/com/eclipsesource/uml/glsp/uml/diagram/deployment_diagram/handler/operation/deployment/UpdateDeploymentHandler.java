/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.deployment;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Deployment;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Deployment;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment.UpdateDeploymentArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment.UpdateDeploymentContribution;

public final class UpdateDeploymentHandler
   extends BaseUpdateElementHandler<Deployment, UpdateDeploymentArgument> {

   public UpdateDeploymentHandler() {
      super(UmlDeployment_Deployment.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Deployment element,
      final UpdateDeploymentArgument updateArgument) {
      return UpdateDeploymentContribution.create(element, updateArgument);
   }
}
