/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.class_.commands;

import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Classifier;

import com.borkdominik.big.glsp.server.core.commands.emf.BGEMFCommandContext;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

public class CreateNestedClassifierCommand<TElement extends Classifier>
   extends UMLCreateNodeCommand<TElement, Class, CreateNestedClassifierCommand.Argument<TElement>> {

   @Getter
   @SuperBuilder(builderMethodName = "createNestedClassifierArgumentBuilder")
   public static class Argument<TElement> extends UMLCreateNodeCommand.Argument<TElement, Class> {

   }

   public CreateNestedClassifierCommand(final BGEMFCommandContext context, final Class parent,
      final Argument<TElement> argument) {
      super(context, parent, argument);
   }

   @Override
   protected TElement createElement(final Class parent, final Argument<TElement> argument) {
      var element = super.createElement(parent, argument);

      if (!parent.getNestedClassifiers().contains(element)) {
         parent.getNestedClassifiers().add(element);
      }

      return element;
   }
}
