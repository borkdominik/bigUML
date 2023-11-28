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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.combined_fragment;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.InteractionFragment;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_operand.CreateInteractionOperandCompoundCommand;

public final class CreateCombinedFragmentCompoundCommand extends CompoundCommand {

   public CreateCombinedFragmentCompoundCommand(final ModelContext context, final InteractionFragment parent,
      final GPoint position) {
      var command = new CreateCombinedFragmentSemanticCommand(context, parent);

      this.append(command);
      this.append(
         new CreateInteractionOperandCompoundCommand(context, command::getSemanticElement, GraphUtil.point(0, 0)));

      // creates combined fragment of type ALT by default, which defaults to two Interaction operands
      this.append(
         new CreateInteractionOperandCompoundCommand(context, command::getSemanticElement, GraphUtil.point(0, 50)));
      this.append(
         new AddShapeNotationCommand(context, command::getSemanticElement, position, GraphUtil.dimension(300, 200)));

   }
}
