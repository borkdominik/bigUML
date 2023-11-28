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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.messageOccurrence;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.constants.UmlMessageSort;

public final class CreateMessageOccurrenceCompoundCommand extends CompoundCommand {

   CreateMessageOccurrenceSemanticCommand command;
   double diameter = 10;
   double verticalOffset = -44 - diameter / 2;

   public CreateMessageOccurrenceCompoundCommand(final ModelContext context, final Lifeline parent,
      final GPoint position) {

      command = new CreateMessageOccurrenceSemanticCommand(context, parent);

      this.append(command);
      this.append(
         new AddShapeNotationCommand(context, command::getSemanticElement,
            GraphUtil.point(0, Math.max(0, position.getY() + verticalOffset)),
            GraphUtil.dimension(diameter, diameter)));
   }

   public CreateMessageOccurrenceCompoundCommand(final ModelContext context, final Lifeline parent,
      final UmlMessageSort messageSort) {

      if (messageSort == UmlMessageSort.CREATE) {
         command = new CreateMessageOccurrenceSemanticCommand(context, parent);
         this.append(command);
      } else {
         new CreateMessageOccurrenceCompoundCommand(context, parent);
      }

   }

   public CreateMessageOccurrenceCompoundCommand(final ModelContext context, final Lifeline parent) {
      command = new CreateMessageOccurrenceSemanticCommand(context, parent);

      this.append(command);
   }

   public MessageOccurrenceSpecification getSemanticElement() { return command.getSemanticElement(); }
}
