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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.destructionOccurrence;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.DestructionOccurrenceSpecification;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;

public final class CreateDestructionOccurrenceCompoundCommand extends CompoundCommand {

   CreateDestructionOccurrenceSemanticCommand command;
   int size = 10;

   public CreateDestructionOccurrenceCompoundCommand(final ModelContext context, final Lifeline parent,
      final GPoint position) {

      command = new CreateDestructionOccurrenceSemanticCommand(context, parent);

      // TODO: implement in higher level, this only workaround
      var verticalOffset = 40;

      this.append(command);
      this.append(
         new AddShapeNotationCommand(context, command::getSemanticElement,
            GraphUtil.point(0, position.getY() + verticalOffset),
            GraphUtil.dimension(size, size)));

      // Alternative: just trigger the resizing of the lifeline and it will resize to fit the last element
      // var modifyLifeline = new UmlChangeBoundsNotationCommand(context,
      // parent, null, Optional.ofNullable(GraphUtil.dimension(0, position.getY())));
      // this.append(modifyLifeline);
   }

   public DestructionOccurrenceSpecification getSemanticElement() { return command.getSemanticElement(); }
}
