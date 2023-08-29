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
package com.eclipsesource.uml.modelserver.uml.elements.parameter.commands;

import java.util.List;

import org.eclipse.uml2.uml.Parameter;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementSemanticCommand;

public class UpdateParameterSemanticCommand
   extends BaseUpdateSemanticElementCommand<Parameter, UpdateParameterArgument> {

   public UpdateParameterSemanticCommand(final ModelContext context, final Parameter semanticElement,
      final UpdateParameterArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Parameter semanticElement, final UpdateParameterArgument updateArgument) {
      include(List.of(new UpdateNamedElementSemanticCommand(context, semanticElement, updateArgument)));

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
   }

}
