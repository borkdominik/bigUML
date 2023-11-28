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
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.InteractionFragment;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;
import org.eclipse.uml2.uml.MessageSort;

import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Message;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateEdgeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.message.CreateMessageContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.constants.UmlMessageSort;
import com.google.inject.Inject;

public class CreateCreateMessageHandler
   extends BaseCreateEdgeHandler<Lifeline, Lifeline> implements CreateLocationAwareNodeHandler {

   public CreateCreateMessageHandler() {
      super(UmlSequence_Message.Variant.createTypeId());
   }

   @Inject
   protected EMFIdGenerator idGenerator;

   @Override
   protected CCommand createCommand(final CreateEdgeOperation operation, final Lifeline source, final Lifeline target) {

      var sourcePosition = operation.getArgs().get("sourcePosition").split(",");
      double sourceX = Double.parseDouble(sourcePosition[0]);
      double sourceY = Double.parseDouble(sourcePosition[1]);

      var targetPosition = operation.getArgs().get("targetPosition").split(",");
      double targetX = Double.parseDouble(targetPosition[0]);
      double targetY = Double.parseDouble(targetPosition[1]); // could also set to 0 here

      var keyword = UmlMessageSort.CREATE;

      validateNotCreatingItself(source, target);
      validateNotAlreadyCreated(target);
      validateNoCreationCylces(source, target);
      validateCreationIsFirst(target, relativeLocationOf(modelState, idGenerator.getOrCreateId(target), targetX,
         targetY));

      return CreateMessageContribution.create(
         source,
         target,
         relativeLocationOf(modelState, idGenerator.getOrCreateId(source), sourceX, sourceY),
         relativeLocationOf(modelState, idGenerator.getOrCreateId(target), targetX, targetY),
         keyword);

   }

   private void validateNoCreationCylces(final Lifeline source, final Lifeline target) {
      if (creationCycle(source, target)) {
         throw new GLSPServerException(
            "Invalid modelling: The lifeline " + source.getName() + " and " + target.getName()
               + " can't create eachoter");
      }
   }

   private void validateNotAlreadyCreated(final Lifeline target) {
      if (alreadyCreated(target)) {
         throw new GLSPServerException(
            "Invalid modelling: The lifeline " + target.getName() + " is already created by a CREATE message");
      }
   }

   private void validateNotCreatingItself(final Lifeline source, final Lifeline target) {
      if (selfCreation(source, target)) {
         throw new GLSPServerException(
            "Invalid modelling: The lifeline " + source.getName() + " can't CREATE itself");
      }
   }

   private void validateCreationIsFirst(final Lifeline target, final GPoint relativeTargetPosition) {
      for (InteractionFragment fragment : target.getCoveredBys()) {
         modelState.getIndex().getNotation(fragment, Shape.class).ifPresent(shape -> {
            if (shape.getPosition().getY() < relativeTargetPosition.getY()) {
               throw new GLSPServerException(
                  "Invalid modelling: The create message has to be the first message!");
            }
         });
      }
   }

   private boolean selfCreation(final Lifeline source, final Lifeline target) {
      return source == target;
   }

   private boolean alreadyCreated(final Lifeline lifeline) {
      return lifeline.getCoveredBys().stream()
         .filter(f -> f instanceof MessageOccurrenceSpecification)
         .filter(m -> ((MessageOccurrenceSpecification) m).getMessage()
            .getMessageSort() == MessageSort.CREATE_MESSAGE_LITERAL)
         .filter(m -> ((MessageOccurrenceSpecification) m).getMessage().getReceiveEvent() == m)
         .count() > 0;
   }

   private boolean creationCycle(final Lifeline source, final Lifeline target) {
      return source.getCoveredBys().stream()
         .filter(f -> f instanceof MessageOccurrenceSpecification)
         .filter(o -> ((MessageOccurrenceSpecification) o).getMessage()
            .getMessageSort() == MessageSort.CREATE_MESSAGE_LITERAL)
         .map(o -> ((MessageOccurrenceSpecification) o).getMessage())
         .filter(m -> ((MessageOccurrenceSpecification) m.getSendEvent()).getCovered() == target ||
            ((MessageOccurrenceSpecification) m.getReceiveEvent()).getCovered() == target)
         .count() > 0;

   }

}
