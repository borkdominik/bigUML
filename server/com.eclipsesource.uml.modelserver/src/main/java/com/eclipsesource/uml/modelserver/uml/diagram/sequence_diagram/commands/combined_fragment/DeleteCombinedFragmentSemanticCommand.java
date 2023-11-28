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

import org.eclipse.uml2.uml.CombinedFragment;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.InteractionFragment;
import org.eclipse.uml2.uml.InteractionOperand;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public class DeleteCombinedFragmentSemanticCommand
   extends BaseDeleteSemanticChildCommand<InteractionFragment, CombinedFragment> {

   public DeleteCombinedFragmentSemanticCommand(final ModelContext context, final CombinedFragment semanticElement) {
      super(context, getEnclosingInteractionFragment(semanticElement), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final InteractionFragment parent, final CombinedFragment child) {
      if (parent instanceof Interaction) {
         ((Interaction) parent).getFragments().remove(child);
      } else {
         ((InteractionOperand) parent).getFragments().remove(child);
      }
   }

   protected static InteractionFragment getEnclosingInteractionFragment(final CombinedFragment semanticElement) {
      InteractionFragment parent;
      parent = semanticElement.getEnclosingOperand();
      if (parent == null) {
         parent = semanticElement.getEnclosingInteraction();
      }
      return parent;

   }
}
