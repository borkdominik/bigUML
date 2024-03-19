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

import java.util.function.BiFunction;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.NamedElement;

import com.borkdominik.big.glsp.server.core.commands.emf.BGEMFCommandContext;
import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateEdgeSemanticCommand;

import lombok.Builder;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

public class UMLCreateEdgeCommand<TElement extends EObject, TSource extends EObject, TTarget extends EObject, TArgument extends UMLCreateEdgeCommand.Argument<TElement, TSource, TTarget>>
   extends
   BGCreateEdgeSemanticCommand<TElement, TSource, TTarget, TArgument> {

   @Getter
   @SuperBuilder(builderMethodName = "createEdgeArgumentBuilder")
   public static class Argument<TElement, TSource, TTarget> {
      protected BiFunction<TSource, TTarget, TElement> supplier;
      @Builder.Default
      protected boolean initName = false;
   }

   public UMLCreateEdgeCommand(final BGEMFCommandContext context, final TSource source, final TTarget target,
      final TArgument argument) {
      super(context, context.modelState().getSemanticModel(), source, target, argument);
   }

   @Override
   protected TElement createElement(final TSource source, final TTarget target, final TArgument argument) {
      var element = argument.getSupplier().apply(source, target);

      if (element == null) {
         throw new GLSPServerException(
            String.format("[%s] Failed to create child for source %s and target %s",
               this.getClass().getSimpleName(),
               source.getClass().getSimpleName(),
               target.getClass().getSimpleName()));
      }

      if (argument.initName
         && (element instanceof NamedElement ne && (ne.getName() == null || ne.getName().isEmpty()))) {
         ne.setName(element.getClass().getSimpleName().replace("Impl", ""));
      }

      return element;
   }
}
