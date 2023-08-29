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
package com.eclipsesource.uml.modelserver.uml.elements.enumeration_literal.commands;

import java.util.List;

import org.eclipse.uml2.uml.EnumerationLiteral;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementSemanticCommand;

public class UpdateEnumerationLiteralSemanticCommand
   extends BaseUpdateSemanticElementCommand<EnumerationLiteral, UpdateEnumerationLiteralArgument> {

   public UpdateEnumerationLiteralSemanticCommand(final ModelContext context, final EnumerationLiteral semanticElement,
      final UpdateEnumerationLiteralArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final EnumerationLiteral semanticElement,
      final UpdateEnumerationLiteralArgument updateArgument) {
      include(List.of(new UpdateNamedElementSemanticCommand(context, semanticElement, updateArgument)));
   }

}
