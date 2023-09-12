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

import org.eclipse.uml2.uml.LiteralBoolean;
import org.eclipse.uml2.uml.LiteralInteger;
import org.eclipse.uml2.uml.LiteralSpecification;
import org.eclipse.uml2.uml.LiteralString;
import org.eclipse.uml2.uml.Slot;
import org.eclipse.uml2.uml.UMLPackage;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;

public final class AddLiteralSpecificationSemanticCommand
   extends BaseCreateSemanticChildCommand<Slot, LiteralSpecification> {

   protected final AddLiteralSpecificationArgument argument;

   public AddLiteralSpecificationSemanticCommand(final ModelContext context,
      final Slot parent, final AddLiteralSpecificationArgument argument) {
      super(context, parent);
      this.argument = argument;
   }

   @Override
   protected LiteralSpecification createSemanticElement(final Slot parent) {
      if (argument.literalSpecification.equals(LiteralBoolean.class)) {
         return (LiteralSpecification) parent.createValue(null, null, UMLPackage.Literals.LITERAL_BOOLEAN);
      } else if (argument.literalSpecification.equals(LiteralString.class)) {
         return (LiteralSpecification) parent.createValue(null, null, UMLPackage.Literals.LITERAL_STRING);
      } else if (argument.literalSpecification.equals(LiteralInteger.class)) {
         return (LiteralSpecification) parent.createValue(null, null, UMLPackage.Literals.LITERAL_INTEGER);
      }

      throw new IllegalStateException();
   }
}
