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

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public final class UpdateCombinedFragmentSemanticCommand
   extends BaseUpdateSemanticElementCommand<CombinedFragment, UpdateCombinedFragmentArgument> {

   public UpdateCombinedFragmentSemanticCommand(final ModelContext context,
      final CombinedFragment semanticElement,
      final UpdateCombinedFragmentArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final CombinedFragment semanticElement,
      final UpdateCombinedFragmentArgument updateArgument) {
      updateArgument.name().ifPresent(arg -> {
         semanticElement.setName(arg);
      });

      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
      });

      updateArgument.interactionOperatorType().ifPresent(arg -> {
         semanticElement.setInteractionOperator(arg);
      });
   }

}
