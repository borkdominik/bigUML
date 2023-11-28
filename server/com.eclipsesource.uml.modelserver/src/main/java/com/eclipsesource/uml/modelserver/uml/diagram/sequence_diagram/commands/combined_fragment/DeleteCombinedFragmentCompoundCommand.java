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
import org.eclipse.uml2.uml.CombinedFragment;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_operand.DeleteInteractionOperandCompoundCommand;

public final class DeleteCombinedFragmentCompoundCommand extends CompoundCommand {

   public DeleteCombinedFragmentCompoundCommand(final ModelContext context, final CombinedFragment semanticElement) {
      semanticElement.getOperands().stream()
         .filter(f -> f != null)
         .map(e -> new DeleteInteractionOperandCompoundCommand(context, e))
         .forEach(c -> this.append(c));

      this.append(new DeleteCombinedFragmentSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

   }
}
