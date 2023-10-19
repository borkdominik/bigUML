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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_operand;

import java.util.function.Supplier;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.CombinedFragment;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;

public final class CreateInteractionOperandCompoundCommand extends CompoundCommand {

   public CreateInteractionOperandCompoundCommand(final ModelContext context, final CombinedFragment parent,
      final GPoint position) {
      Supplier<CombinedFragment> parentSupplier = () -> parent;
      var command = new CreateInteractionOperandSemanticCommand(context, parentSupplier);

      this.append(command);
      this.append(
         new AddShapeNotationCommand(context, command::getSemanticElement, position, GraphUtil.dimension(300, 150)));
   }

   public CreateInteractionOperandCompoundCommand(final ModelContext context,
      final Supplier<CombinedFragment> parentSupplier,
      final GPoint position) {
      var command = new CreateInteractionOperandSemanticCommand(context, parentSupplier);

      this.append(command);
      this.append(
         new AddShapeNotationCommand(context, command::getSemanticElement, position, GraphUtil.dimension(300, 150)));
   }
}
