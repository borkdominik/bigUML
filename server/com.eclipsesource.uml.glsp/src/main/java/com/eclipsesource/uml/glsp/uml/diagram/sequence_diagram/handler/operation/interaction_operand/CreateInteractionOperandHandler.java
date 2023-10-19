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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction_operand;

import java.util.Arrays;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.CombinedFragment;
import org.eclipse.uml2.uml.InteractionOperatorKind;

import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_InteractionOperand;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_operand.CreateInteractionOperandContribution;

public class CreateInteractionOperandHandler
   extends BaseCreateChildNodeHandler<CombinedFragment> implements CreateLocationAwareNodeHandler {

   public CreateInteractionOperandHandler() {
      super(UmlSequence_InteractionOperand.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final CombinedFragment parent) {

      if (denyAdditionalInteractionOperands(parent)) {
         throw new GLSPServerException(
            "Invalid modelling: The parent Combined Fragment  " + parent.getName()
               + " does not allow more Interaction Operands due to its " + parent.getInteractionOperator()
               + " InteractionOperatorKind.");
      }

      return CreateInteractionOperandContribution.create(
         parent,
         relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)));
   }

   private boolean denyAdditionalInteractionOperands(final CombinedFragment parent) {
      var existingOperands = parent.getOperands().size();
      var singleOperandOperator = Arrays.asList(
         InteractionOperatorKind.LOOP,
         InteractionOperatorKind.OPT,
         InteractionOperatorKind.BREAK,
         InteractionOperatorKind.STRICT,
         InteractionOperatorKind.CRITICAL);

      if (existingOperands > 0) {
         if (singleOperandOperator.contains(parent.getInteractionOperator().getValue())) {
            return true;
         }
      }
      return false;
   }
}
