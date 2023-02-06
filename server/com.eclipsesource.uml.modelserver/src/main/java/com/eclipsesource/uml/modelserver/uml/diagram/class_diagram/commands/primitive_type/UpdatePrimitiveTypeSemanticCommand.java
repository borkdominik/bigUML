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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.primitive_type;

import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public final class UpdatePrimitiveTypeSemanticCommand
   extends BaseUpdateSemanticElementCommand<PrimitiveType, UpdatePrimitiveTypeArgument> {

   public UpdatePrimitiveTypeSemanticCommand(final ModelContext context, final PrimitiveType semanticElement,
      final UpdatePrimitiveTypeArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final PrimitiveType semanticElement,
      final UpdatePrimitiveTypeArgument updateArgument) {
      updateArgument.isAbstract().ifPresent(arg -> {
         semanticElement.setIsAbstract(arg);
      });

      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
      });
   }

}
