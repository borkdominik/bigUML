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
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;
import org.eclipse.uml2.uml.MessageSort;

import com.eclipsesource.uml.modelserver.shared.extension.NotationElementAccessor;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.messageOccurrence.DeleteMessageOccurrenceCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.core.commands.SDShiftShapeCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.shared.notation.SDDeleteNotationElementCommand;

public class DeleteMessageCompoundCommand extends CompoundCommand {

   public DeleteMessageCompoundCommand(final ModelContext context, final Message semanticElement) {
      this.append(new DeleteMessageSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      deleteEvent(context, semanticElement, (MessageOccurrenceSpecification) semanticElement.getSendEvent());
      deleteEvent(context, semanticElement, (MessageOccurrenceSpecification) semanticElement.getReceiveEvent());

      if (semanticElement.getMessageSort() == MessageSort.CREATE_MESSAGE_LITERAL) {
         resetLifelinePositioning(context, semanticElement);
      }
   }

   private void resetLifelinePositioning(final ModelContext context, final Message semanticElement) {
      var fixedLifelineHeigt = 30;
      var correctionDistance = 45;
      var resetDistance = 0.0;
      var createdLifeline = ((MessageOccurrenceSpecification) semanticElement.getReceiveEvent()).getCovered();
      var lifeline = SemanticElementAccessor.getId(createdLifeline);
      var notation = new NotationElementAccessor(context).getElement(lifeline).get();
      if (notation instanceof Shape) {
         resetDistance = ((Shape) notation).getPosition().getY();
      }
      this.append(new SDShiftShapeCommand(context,
         createdLifeline,
         GraphUtil.point(0, fixedLifelineHeigt - correctionDistance - resetDistance)));
   }

   private void deleteEvent(final ModelContext context, final Message semanticElement,
      final MessageOccurrenceSpecification event) {
      if (event != null) {
         this.append(
            new DeleteMessageOccurrenceCompoundCommand(context, event));
      } else {
         deleteMessageAnchor(context, semanticElement);
      }
   }

   private void deleteMessageAnchor(final ModelContext context, final Message semanticElement) {
      var anchorId = SemanticElementAccessor.getId(semanticElement) + "_MessageAnchor";
      var anchorShape = new NotationElementAccessor(context).getElement(anchorId, Shape.class).get();
      this.append(new SDDeleteNotationElementCommand(context, anchorShape));
   }

}
