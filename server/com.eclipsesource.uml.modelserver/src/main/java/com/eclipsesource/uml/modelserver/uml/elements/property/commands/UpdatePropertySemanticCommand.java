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
package com.eclipsesource.uml.modelserver.uml.elements.property.commands;

import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public class UpdatePropertySemanticCommand extends BaseUpdateSemanticElementCommand<Property, UpdatePropertyArgument> {

   public UpdatePropertySemanticCommand(final ModelContext context, final Property semanticElement,
      final UpdatePropertyArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Property semanticElement, final UpdatePropertyArgument updateArgument) {
      updateArgument.name().ifPresent(arg -> {
         semanticElement.setName(arg);
      });

      updateArgument.typeId().ifPresent(arg -> {
         semanticElementAccessor.getElement(arg, Type.class).ifPresentOrElse(type -> {
            semanticElement.setType(type);
         }, () -> semanticElement.setType(null));
      });

      updateArgument.lowerBound().ifPresent(arg -> {
         semanticElement.setLower(arg);
      });

      updateArgument.upperBound().ifPresent(arg -> {
         semanticElement.setUpper(arg);
      });

      updateArgument.defaultValue().ifPresent(arg -> {
         semanticElement.setDefaultValue(arg);
      });
   }
}
