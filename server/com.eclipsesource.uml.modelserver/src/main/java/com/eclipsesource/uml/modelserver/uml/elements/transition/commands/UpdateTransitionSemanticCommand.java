/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.elements.transition.commands;

import java.util.List;

import org.eclipse.uml2.uml.Transition;
import org.eclipse.uml2.uml.Vertex;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementSemanticCommand;

public class UpdateTransitionSemanticCommand
   extends BaseUpdateSemanticElementCommand<Transition, UpdateTransitionArgument> {

   public UpdateTransitionSemanticCommand(final ModelContext context, final Transition semanticElement,
      final UpdateTransitionArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Transition semanticElement,
      final UpdateTransitionArgument updateArgument) {
      include(List.of(new UpdateNamedElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.sourceId().ifPresent(arg -> {
         semanticElement.setSource(semanticElementAccessor.getElement(arg, Vertex.class).get());
      });

      updateArgument.targetId().ifPresent(arg -> {
         semanticElement.setTarget(semanticElementAccessor.getElement(arg, Vertex.class).get());
      });
   }

}
