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
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.parameter;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Operation;

import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Parameter;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.parameter.CreateParameterContribution;

public final class CreateParameterHandler
   extends BaseCreateChildNodeHandler<Operation> {

   public CreateParameterHandler() {
      super(UmlDeployment_Parameter.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final Operation parent) {
      return CreateParameterContribution.create(parent);
   }

}
