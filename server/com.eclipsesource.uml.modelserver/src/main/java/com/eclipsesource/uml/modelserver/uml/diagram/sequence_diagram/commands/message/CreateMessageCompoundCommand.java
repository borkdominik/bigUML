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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.message;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.model.ModelFactory;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.behaviorExecution.CreateBehaviorExecutionCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.destructionOccurrence.CreateDestructionOccurrenceCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.messageOccurrence.CreateMessageOccurrenceCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.constants.UmlMessageKind;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.constants.UmlMessageSort;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.core.commands.SDShiftShapeCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.shared.notation.SDAddShapeNotationCommand;

public final class CreateMessageCompoundCommand extends CompoundCommand {

   double verticalFundLostPositioningCorrection = -54;
   double verticalPositionOnLifelineCorrection = -35;
   double verticalPositionCreateLifelineCorrection = -61;
   double defaultDelay = 80;

   public CreateMessageCompoundCommand(final ModelContext context,
      final Lifeline source, final Lifeline target, final GPoint sourcePosition, final GPoint targetPosition,
      final UmlMessageSort sort, final UmlMessageKind kind) {

      var createSourceCommand = new CreateMessageOccurrenceCompoundCommand(context, source,
         sourcePosition);
      this.append(createSourceCommand);

      var createTargetCommand = new CreateMessageOccurrenceCompoundCommand(context, target,
         targetPosition);

      var command = new CreateMessageSemanticCommand(context, createSourceCommand::getSemanticElement,
         createTargetCommand::getSemanticElement, sort, kind);

      switch (sort) {
         case CREATE:

            var moveLifelineCommand = new SDShiftShapeCommand(context, target,
               shiftedYPosition(targetPosition, verticalPositionCreateLifelineCorrection));

            var targetCreatePortCommand = new CreateMessageOccurrenceCompoundCommand(context, target, sort);

            command = new CreateMessageSemanticCommand(context, createSourceCommand::getSemanticElement,
               targetCreatePortCommand::getSemanticElement, sort, kind);
            this.append(moveLifelineCommand);
            this.append(targetCreatePortCommand);
            break;

         case DELETE:
            var targetDestroyPortCommand = new CreateDestructionOccurrenceCompoundCommand(context, target,
               targetPosition);
            command = new CreateMessageSemanticCommand(context, createSourceCommand::getSemanticElement,
               targetDestroyPortCommand::getSemanticElement, sort, kind);
            this.append(targetDestroyPortCommand);
            break;
         default:
            this.append(createTargetCommand);
            break;
      }

      this.append(command);
      this.append(new AddEdgeNotationCommand(context, command::getSemanticElement));

      switch (sort) {
         case SYNC:
            var replySourcePortCommand = new CreateMessageOccurrenceCompoundCommand(context, target,
               shiftedYPosition(targetPosition, defaultDelay));
            var replyTargetPortCommand = new CreateMessageOccurrenceCompoundCommand(context, source,
               shiftedYPosition(sourcePosition, defaultDelay));
            var replyCommand = new CreateMessageSemanticCommand(context, replySourcePortCommand::getSemanticElement,
               replyTargetPortCommand::getSemanticElement, UmlMessageSort.REPLY, kind);

            var executionSpecificationCommand = new CreateBehaviorExecutionCompoundCommand(context, target,
               targetPosition,
               createTargetCommand::getSemanticElement, replySourcePortCommand::getSemanticElement);
            this.append(replySourcePortCommand);
            this.append(replyTargetPortCommand);
            this.append(replyCommand);
            this.append(executionSpecificationCommand);
            this.append(new AddEdgeNotationCommand(context, replyCommand::getSemanticElement));
            break;
      }
   }

   // Found Message
   public CreateMessageCompoundCommand(final ModelContext context,
      final Interaction source, final Lifeline target, final GPoint sourcePosition, final GPoint targetPosition,
      final UmlMessageSort sort, final UmlMessageKind kind) {

      var targetPortCommand = new CreateMessageOccurrenceCompoundCommand(context, target, targetPosition);
      this.append(targetPortCommand);

      var command = new CreateMessageSemanticCommand(context, null,
         targetPortCommand::getSemanticElement, sort, kind);
      this.append(command);

      this.append(new SDAddShapeNotationCommand(context,
         () -> {
            var anchor = ModelFactory.eINSTANCE.createMessageAnchor();
            anchor.setId(SemanticElementAccessor.getId(command.getSemanticElement()) + "_MessageAnchor");
            return anchor;
         },
         () -> SemanticElementAccessor.getId(command.getSemanticElement()) + "_MessageAnchor",
         shiftedYPosition(sourcePosition, verticalFundLostPositioningCorrection),
         GraphUtil.dimension(10, 10)));
      var edge = new AddEdgeNotationCommand(context, command::getSemanticElement);
      this.append(edge);

   }

   // Lost Message
   public CreateMessageCompoundCommand(final ModelContext context,
      final Lifeline source, final Interaction target, final GPoint sourcePosition, final GPoint targetPosition,
      final UmlMessageSort sort, final UmlMessageKind kind) {

      var sourcePortCommand = new CreateMessageOccurrenceCompoundCommand(context, source, sourcePosition);
      this.append(sourcePortCommand);

      var command = new CreateMessageSemanticCommand(context,
         sourcePortCommand::getSemanticElement, null, sort, kind);
      this.append(command);

      this.append(new SDAddShapeNotationCommand(context,
         () -> {
            var anchor = ModelFactory.eINSTANCE.createMessageAnchor();
            anchor.setId(SemanticElementAccessor.getId(command.getSemanticElement()) + "_MessageAnchor");
            return anchor;
         },
         () -> SemanticElementAccessor.getId(command.getSemanticElement()) + "_MessageAnchor",
         shiftedYPosition(targetPosition, verticalFundLostPositioningCorrection),
         GraphUtil.dimension(10, 10)));
      var edge = new AddEdgeNotationCommand(context, command::getSemanticElement);
      this.append(edge);
   }

   public GPoint shiftedYPosition(final GPoint pos, final double distance) {
      return GraphUtil.point(pos.getX(), pos.getY() + distance);
   }
}
