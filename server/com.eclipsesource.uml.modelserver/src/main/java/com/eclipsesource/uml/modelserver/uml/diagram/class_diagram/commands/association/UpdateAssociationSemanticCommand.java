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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association;

import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public final class UpdateAssociationSemanticCommand
   extends BaseUpdateSemanticElementCommand<Association, UpdateAssociationArgument> {

   public UpdateAssociationSemanticCommand(final ModelContext context, final Association semanticElement,
      final UpdateAssociationArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Association semanticElement,
      final UpdateAssociationArgument updateArgument) {
      updateArgument.name().ifPresent(arg -> {
         semanticElement.setName(arg);
      });

      updateArgument.label().ifPresent(arg -> {
         throw new UnsupportedOperationException();
      });

      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
      });

      updateArgument.endTypeIds().ifPresent(arg -> {
         var oldMemberEnds = semanticElement.getMemberEnds();
         var oldSourceProperty = oldMemberEnds.get(0);
         var oldSource = (AttributeOwner) oldSourceProperty.getOwner();
         var oldTargetProperty = oldMemberEnds.get(1);
         var oldTarget = (AttributeOwner) oldTargetProperty.getOwner();

         var elements = semanticElementAccessor.getElements(arg.toArray(new String[0]), Type.class);
         var source = (Type & AttributeOwner) elements.get(0);
         var target = (Type & AttributeOwner) elements.get(1);

         oldSource.getOwnedAttributes().remove(oldSourceProperty);
         oldSourceProperty.setType(target);
         source.getOwnedAttributes().add(oldSourceProperty);

         oldTarget.getOwnedAttributes().remove(oldTargetProperty);
         oldTargetProperty.setType(source);
         target.getOwnedAttributes().add(oldTargetProperty);
      });
   }

}
