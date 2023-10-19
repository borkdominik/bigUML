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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.behaviorExecution;

import java.util.function.Supplier;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.OccurrenceSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.executionOccurrence.CreateExecutionOccurrenceCompoundCommand;

public final class CreateBehaviorExecutionCompoundCommand extends CompoundCommand {

   int width = 10;
   int defaultDuration = 80;

   public CreateBehaviorExecutionCompoundCommand(final ModelContext context, final Lifeline parent,
      final GPoint position) {

      var startOccurrenceCommand = new CreateExecutionOccurrenceCompoundCommand(context, parent, position);
      var finishOccurrenceCommand = new CreateExecutionOccurrenceCompoundCommand(context, parent,
         shiftedPosition(position, defaultDuration));

      var command = new CreateBehaviorExecutionSemanticCommand(context, parent,
         startOccurrenceCommand::getSemanticElement,
         finishOccurrenceCommand::getSemanticElement);

      this.append(startOccurrenceCommand);
      this.append(finishOccurrenceCommand);
      this.append(command);
      this.append(
         new AddShapeNotationCommand(context, command::getSemanticElement, GraphUtil.point(0, position.getY()),
            GraphUtil.dimension(width, defaultDuration)));
   }

   public CreateBehaviorExecutionCompoundCommand(final ModelContext context, final Lifeline parent,
      final GPoint position, final Supplier<OccurrenceSpecification> startOccurrence,
      final Supplier<OccurrenceSpecification> endOccurrence) {

      var command = new CreateBehaviorExecutionSemanticCommand(context, parent, startOccurrence,
         endOccurrence);

      this.append(command);
      this.append(
         new AddShapeNotationCommand(context, command::getSemanticElement, GraphUtil.point(0, position.getY()),
            GraphUtil.dimension(width, defaultDuration)));
   }

   public GPoint shiftedPosition(final GPoint pos, final int distance) {
      return GraphUtil.point(pos.getX(), pos.getY() + distance);
   }
}
