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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.executionOccurrence;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_ExecutionOccurrence;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.executionOccurrence.CreateExecutionOccurrenceContribution;

public final class CreateExecutionOccurrenceHandler
   extends BaseCreateChildNodeHandler<Lifeline> implements CreateLocationAwareNodeHandler {

   public CreateExecutionOccurrenceHandler() {
      super(UmlSequence_ExecutionOccurrence.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final Lifeline container) {
      return CreateExecutionOccurrenceContribution.create(
         container,
         relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)));
   }

}
