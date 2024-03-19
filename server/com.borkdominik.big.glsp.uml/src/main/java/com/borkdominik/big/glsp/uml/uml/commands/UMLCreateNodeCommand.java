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

import java.util.function.Function;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.NamedElement;

import com.borkdominik.big.glsp.server.core.commands.emf.BGEMFCommandContext;
import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;

import lombok.Builder;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

public class UMLCreateNodeCommand<TElement extends EObject, TParent extends EObject, TArgument extends UMLCreateNodeCommand.Argument<TElement, TParent>>
   extends
   BGCreateNodeSemanticCommand<TElement, TParent, TArgument> {

   @Getter
   @SuperBuilder(builderMethodName = "createChildArgumentBuilder")
   public static class Argument<TElement, TParent> {
      protected Function<TParent, TElement> supplier;
      @Builder.Default
      protected boolean initName = true;
   }

   public UMLCreateNodeCommand(final BGEMFCommandContext context, final TParent parent,
      final TArgument argument) {
      super(context, context.modelState().getSemanticModel(), parent, argument);
   }

   @Override
   protected TElement createElement(final TParent parent, final TArgument argument) {
      var element = argument.getSupplier().apply(parent);

      if (element == null) {
         throw new GLSPServerException(
            String.format("[%s] Failed to create child for parent %s",
               this.getClass().getSimpleName(),
               parent.getClass().getSimpleName()));
      }

      if (argument.initName
         && (element instanceof NamedElement ne && (ne.getName() == null || ne.getName().isEmpty()))) {
         ne.setName(element.getClass().getSimpleName().replace("Impl", ""));
      }

      return element;
   }

}
