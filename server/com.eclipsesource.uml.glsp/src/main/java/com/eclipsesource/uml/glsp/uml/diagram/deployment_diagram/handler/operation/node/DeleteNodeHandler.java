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
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.glsp.uml.handler.operations.delete.BaseDeleteElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.node.DeleteNodeContribution;

public final class DeleteNodeHandler extends BaseDeleteElementHandler<Node> {

   @Override
   protected CCommand createCommand(final Node element) {
      return DeleteNodeContribution.create(element);
   }
}
