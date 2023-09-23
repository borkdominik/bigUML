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
package com.eclipsesource.uml.modelserver.uml.elements.literal_specification.commands;

import java.util.List;

import org.eclipse.uml2.uml.LiteralBoolean;
import org.eclipse.uml2.uml.LiteralInteger;
import org.eclipse.uml2.uml.LiteralSpecification;
import org.eclipse.uml2.uml.LiteralString;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementSemanticCommand;

public class UpdateLiteralSpecificationSemanticCommand
   extends BaseUpdateSemanticElementCommand<LiteralSpecification, UpdateLiteralSpecificationArgument> {

   public UpdateLiteralSpecificationSemanticCommand(final ModelContext context,
      final LiteralSpecification semanticElement,
      final UpdateLiteralSpecificationArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final LiteralSpecification semanticElement,
      final UpdateLiteralSpecificationArgument updateArgument) {
      include(List.of(new UpdateNamedElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.value().ifPresent(arg -> {
         if (semanticElement instanceof LiteralBoolean) {
            var literal = (LiteralBoolean) semanticElement;
            if (arg.equalsIgnoreCase("true") || arg.equalsIgnoreCase("false")) {
               literal.setValue(Boolean.parseBoolean(arg));
            }
         } else if (semanticElement instanceof LiteralString) {
            var literal = (LiteralString) semanticElement;
            literal.setValue(arg);
         } else if (semanticElement instanceof LiteralInteger) {
            var literal = (LiteralInteger) semanticElement;
            try {
               literal.setValue(Integer.parseInt(arg));
            } catch (NumberFormatException e) {

            }
         }
      });
   }
}
