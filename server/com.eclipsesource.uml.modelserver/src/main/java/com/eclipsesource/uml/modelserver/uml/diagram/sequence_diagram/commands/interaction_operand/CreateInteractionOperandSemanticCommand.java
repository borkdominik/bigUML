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

import org.eclipse.uml2.uml.CombinedFragment;
import org.eclipse.uml2.uml.InteractionOperand;
import org.eclipse.uml2.uml.InteractionOperatorKind;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateInteractionOperandSemanticCommand
   extends BaseCreateSemanticChildCommand<Supplier<CombinedFragment>, InteractionOperand> {

   public CreateInteractionOperandSemanticCommand(final ModelContext context, final Supplier<CombinedFragment> parent) {
      super(context, parent);
   }

   @Override
   protected InteractionOperand createSemanticElement(final Supplier<CombinedFragment> parentSupplier) {
      var parent = parentSupplier.get();
      var nameGenerator = new ListNameGenerator(InteractionOperand.class,
         parent.getOperands());

      var interactionOperand = parent.createOperand(nameGenerator.newName());
      interactionOperand
         .createGuard(
            parent.getInteractionOperator() == InteractionOperatorKind.ALT_LITERAL
               && parent.getOperands().size() > 1
                  ? "else"
                  : "");
      return interactionOperand;
   }
}
