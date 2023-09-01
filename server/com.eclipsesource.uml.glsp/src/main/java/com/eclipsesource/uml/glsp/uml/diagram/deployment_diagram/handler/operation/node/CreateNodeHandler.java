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
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.node;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;

import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Node;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.node.CreateNodeContribution;

public class CreateNodeHandler extends BaseCreateChildNodeHandler<Object>
   implements CreateLocationAwareNodeHandler {

   public CreateNodeHandler() {
      super(UmlDeployment_Node.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final Object parent) {
      return CreateNodeContribution.create(
         parent,
         relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)));
   }
}
