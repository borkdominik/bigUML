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
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.message;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.CommunicationTypes;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message.AddMessageContribution;

public final class CreateMessageHandler
   extends BaseCreateEdgeHandler<Lifeline, Lifeline> {

   public CreateMessageHandler() {
      super(CommunicationTypes.MESSAGE);
   }

   @Override
   protected CCommand createCommand(final CreateEdgeOperation operation, final Lifeline source, final Lifeline target) {
      return AddMessageContribution.create(
         source,
         target);

   }

}
