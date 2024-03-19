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
package com.borkdominik.big.glsp.uml.uml.commands;

import java.util.function.Consumer;

import org.eclipse.emf.ecore.EObject;

import com.borkdominik.big.glsp.server.core.commands.BGCommandContext;
import com.borkdominik.big.glsp.server.core.commands.semantic.BGUpdateElementSemanticCommand;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

public class UMLUpdateElementCommand<TElement extends EObject, TArgument extends UMLUpdateElementCommand.Argument<TElement>>
   extends
   BGUpdateElementSemanticCommand<TElement, TArgument> {

   @Getter
   @SuperBuilder(builderMethodName = "updateElementArgumentBuilder")
   public static class Argument<TElement> {
      protected Consumer<TElement> consumer;
   }

   public UMLUpdateElementCommand(final BGCommandContext context, final EObject root, final TElement element,
      final TArgument argument) {
      super(context, root, element, argument);
   }

   @Override
   protected void updateElement(final TElement element, final TArgument argument) {
      argument.getConsumer().accept(element);
   }

}
