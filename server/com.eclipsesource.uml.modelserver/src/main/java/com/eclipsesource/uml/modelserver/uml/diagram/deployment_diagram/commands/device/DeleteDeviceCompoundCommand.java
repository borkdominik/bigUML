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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.device;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Device;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.reference.DeploymentDiagramCrossReferenceRemover;

public final class DeleteDeviceCompoundCommand extends CompoundCommand {

   public DeleteDeviceCompoundCommand(final ModelContext context, final Device semanticElement) {
      this.append(new DeleteDeviceSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      new DeploymentDiagramCrossReferenceRemover(context).deleteCommandsFor(semanticElement)
         .forEach(this::append);
   }
}
