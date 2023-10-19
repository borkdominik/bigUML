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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.message;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Message;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateEdgeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.message.CreateMessageContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.constants.UmlMessageSort;
import com.google.inject.Inject;

public class CreateMessageHandler
   extends BaseCreateEdgeHandler<Lifeline, Lifeline> implements CreateLocationAwareNodeHandler {

   public CreateMessageHandler() {
      super(UmlSequence_Message.typeId());
   }

   @Inject
   protected EMFIdGenerator idGenerator;

   @Override
   protected CCommand createCommand(final CreateEdgeOperation operation, final Lifeline source, final Lifeline target) {

      var sourceLocation = operation.getArgs().get("sourceLocation").split(",");
      double sourceX = Double.parseDouble(sourceLocation[0]);
      double sourceY = Double.parseDouble(sourceLocation[1]);

      var targetLocation = operation.getArgs().get("targetLocation").split(",");
      double targetX = Double.parseDouble(targetLocation[0]);
      double targetY = Double.parseDouble(targetLocation[1]);

      var keyword = UmlMessageSort.ASYNC;

      return CreateMessageContribution.create(
         source,
         target,
         relativeLocationOf(modelState, idGenerator.getOrCreateId(source), sourceX, sourceY),
         relativeLocationOf(modelState, idGenerator.getOrCreateId(target), targetX, targetY),
         keyword);

   }

}
