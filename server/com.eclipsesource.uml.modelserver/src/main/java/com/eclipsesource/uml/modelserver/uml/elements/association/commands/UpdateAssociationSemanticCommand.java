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
package com.eclipsesource.uml.modelserver.uml.elements.association.commands;

import java.util.List;

import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementSemanticCommand;

public class UpdateAssociationSemanticCommand
   extends BaseUpdateSemanticElementCommand<Association, UpdateAssociationArgument> {

   public UpdateAssociationSemanticCommand(final ModelContext context, final Association semanticElement,
      final UpdateAssociationArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Association semanticElement,
      final UpdateAssociationArgument updateArgument) {
      include(List.of(new UpdateNamedElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.endTypeIds().ifPresent(arg -> {
         var newElements = semanticElementAccessor.getElements(arg.toArray(new String[0]), Type.class);
         var newSourceType = newElements.get(0);
         var newTargetType = newElements.get(1);

         var oldMemberEnds = semanticElement.getMemberEnds();
         var oldSourceProperty = oldMemberEnds.get(0);
         var oldTargetProperty = oldMemberEnds.get(1);

         if (oldSourceProperty.getOwner() instanceof AttributeOwner
            && oldTargetProperty.getOwner() instanceof AttributeOwner) {
            var oldSourceOwner = (AttributeOwner) oldSourceProperty.getOwner();
            var oldTargetOwner = (AttributeOwner) oldTargetProperty.getOwner();
            var newSourceOwner = (Type & AttributeOwner) newSourceType;
            var newTargetOwner = (Type & AttributeOwner) newTargetType;

            oldSourceOwner.getOwnedAttributes().remove(oldSourceProperty);
            oldSourceProperty.setType(newTargetType);
            newSourceOwner.getOwnedAttributes().add(oldSourceProperty);

            oldTargetOwner.getOwnedAttributes().remove(oldTargetProperty);
            oldTargetProperty.setType(newSourceType);
            newTargetOwner.getOwnedAttributes().add(oldTargetProperty);
         } else if (oldSourceProperty.getOwner() instanceof Association
            && oldTargetProperty.getOwner() instanceof Association) {
            oldSourceProperty.setType(newSourceType);
            oldTargetProperty.setType(newTargetType);
         }

      });
   }

}
