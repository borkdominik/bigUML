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

import org.eclipse.uml2.uml.CombinedFragment;
import org.eclipse.uml2.uml.InteractionOperand;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public class DeleteInteractionOperandSemanticCommand
   extends BaseDeleteSemanticChildCommand<CombinedFragment, InteractionOperand> {

   public DeleteInteractionOperandSemanticCommand(final ModelContext context,
      final InteractionOperand semanticElement) {
      super(context, (CombinedFragment) semanticElement.eContainer(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final CombinedFragment parent, final InteractionOperand child) {
      parent.getOperands().remove(child);
   }
}
