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
package com.eclipsesource.uml.modelserver.uml.elements.slot.commands;

import java.util.List;

import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Slot;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.element.UpdateElementSemanticCommand;

public final class UpdateSlotSemanticCommand
   extends BaseUpdateSemanticElementCommand<Slot, UpdateSlotArgument> {

   public UpdateSlotSemanticCommand(final ModelContext context, final Slot semanticElement,
      final UpdateSlotArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Slot semanticElement, final UpdateSlotArgument updateArgument) {
      include(List.of(new UpdateElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.definingFeatureId().ifPresent(arg -> {
         Property chosenProperty = null;
         if (!arg.isBlank()) {
            chosenProperty = semanticElementAccessor.getElement(arg, Property.class).get();
         }

         semanticElement.setDefiningFeature(chosenProperty);
      });

   }

}
