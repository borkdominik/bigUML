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

import org.eclipse.uml2.uml.LiteralSpecification;
import org.eclipse.uml2.uml.Slot;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;

public final class AddLiteralSpecificationSemanticCommand extends BaseCreateSemanticChildCommand<Slot, LiteralSpecification> {

   protected final AddLiteralSpecificationArgument argument;

   public AddLiteralSpecificationSemanticCommand(final ModelContext context,
      final Slot parent, final AddLiteralSpecificationArgument argument) {
      super(context, parent);
      this.argument = argument;
   }

   @Override
   protected LiteralSpecification createSemanticElement(final Slot parent) {
      parent.getValues().add(argument.literalSpecification);
      /*-
      LiteralSpecification value;
      var arg = "";
      if (arg.equalsIgnoreCase("true") || arg.equalsIgnoreCase("false")) {
         var lBoolean = (LiteralBoolean) parent.createValue(null, null,
            UMLPackage.Literals.LITERAL_BOOLEAN);
         lBoolean.setValue(Boolean.valueOf(arg));
         value = lBoolean;
      
      } else if (canConvertToInt(arg) == true) {
         var lInteger = (LiteralInteger) parent.createValue(null, null,
            UMLPackage.Literals.LITERAL_INTEGER);
         lInteger.setValue(Integer.valueOf(arg));
         value = lInteger;
      
      } else {
         var lString = (LiteralString) parent.createValue(null, null,
            UMLPackage.Literals.LITERAL_STRING);
         lString.setValue('"' + arg + '"');
      
         value = lString;
      }
      */
      return argument.literalSpecification;
   }

   public static boolean canConvertToInt(final String arg) {
      try {
         Integer.parseInt(arg);
         return true;
      } catch (NumberFormatException e) {
         return false;
      }
   }

}
