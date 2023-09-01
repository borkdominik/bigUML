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
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.communication_path;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_CommunicationPath;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.communication_path.CreateCommunicationPathContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.constants.AssociationType;

public final class CreateCommunicationPathHandler
   extends BaseCreateEdgeHandler<Node, Node> {

   public CreateCommunicationPathHandler() {
      super(UmlDeployment_CommunicationPath.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateEdgeOperation operation, final Node source, final Node target) {
      var keyword = AssociationType.ASSOCIATION;
      return CreateCommunicationPathContribution
         .create(source, target, keyword);
   }
}
