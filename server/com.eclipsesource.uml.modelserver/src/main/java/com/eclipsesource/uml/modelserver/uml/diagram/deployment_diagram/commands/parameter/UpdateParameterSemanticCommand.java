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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.parameter;

import org.eclipse.uml2.uml.Parameter;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public final class UpdateParameterSemanticCommand
   extends BaseUpdateSemanticElementCommand<Parameter, UpdateParameterArgument> {

   public UpdateParameterSemanticCommand(final ModelContext context, final Parameter semanticElement,
      final UpdateParameterArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Parameter semanticElement, final UpdateParameterArgument updateArgument) {
      updateArgument.name().ifPresent(arg -> {
         semanticElement.setName(arg);
      });

      updateArgument.label().ifPresent(arg -> {
         throw new UnsupportedOperationException();
      });

      updateArgument.isException().ifPresent(arg -> {
         semanticElement.setIsException(arg);
      });

      updateArgument.isOrdered().ifPresent(arg -> {
         semanticElement.setIsOrdered(arg);
      });

      updateArgument.isStream().ifPresent(arg -> {
         semanticElement.setIsStream(arg);
      });

      updateArgument.isUnique().ifPresent(arg -> {
         semanticElement.setIsUnique(arg);
      });

      updateArgument.directionKind().ifPresent(arg -> {
         semanticElement.setDirection(arg);
      });

      updateArgument.effectKind().ifPresent(arg -> {
         semanticElement.setEffect(arg);
      });

      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
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
