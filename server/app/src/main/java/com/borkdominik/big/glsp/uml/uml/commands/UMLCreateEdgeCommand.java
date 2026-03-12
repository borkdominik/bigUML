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

public class UMLCreateEdgeCommand<TElement extends EObject, TSource extends EObject, TTarget extends EObject, TArgument extends UMLCreateEdgeCommand.Argument<TElement, TSource, TTarget>>
      extends BGCreateEdgeSemanticCommand<TElement, TSource, TTarget, TArgument> {

   public static class Argument<TElement, TSource, TTarget> {
      protected BiFunction<TSource, TTarget, TElement> supplier;
      protected boolean initName;

      private static <TElement, TSource, TTarget> boolean $default$initName() {
         return false;
      }

      public static abstract class ArgumentBuilder<TElement, TSource, TTarget, C extends UMLCreateEdgeCommand.Argument<TElement, TSource, TTarget>, B extends UMLCreateEdgeCommand.Argument.ArgumentBuilder<TElement, TSource, TTarget, C, B>> {
         private BiFunction<TSource, TTarget, TElement> supplier;
         private boolean initName$set;
         private boolean initName$value;

         public B supplier(final BiFunction<TSource, TTarget, TElement> supplier) {
            this.supplier = supplier;
            return self();
         }

         public B initName(final boolean initName) {
            this.initName$value = initName;
            initName$set = true;
            return self();
         }

         protected abstract B self();

         public abstract C build();

         @Override
         public java.lang.String toString() {
            return "UMLCreateEdgeCommand.Argument.ArgumentBuilder(supplier=" + this.supplier + ", initName$value="
                  + this.initName$value + ")";
         }
      }

      private static final class ArgumentBuilderImpl<TElement, TSource, TTarget> extends
            UMLCreateEdgeCommand.Argument.ArgumentBuilder<TElement, TSource, TTarget, UMLCreateEdgeCommand.Argument<TElement, TSource, TTarget>, UMLCreateEdgeCommand.Argument.ArgumentBuilderImpl<TElement, TSource, TTarget>> {
         private ArgumentBuilderImpl() {
         }

         @Override
         protected UMLCreateEdgeCommand.Argument.ArgumentBuilderImpl<TElement, TSource, TTarget> self() {
            return this;
         }

         @Override
         public UMLCreateEdgeCommand.Argument<TElement, TSource, TTarget> build() {
            return new UMLCreateEdgeCommand.Argument<TElement, TSource, TTarget>(this);
         }
      }

      protected Argument(final UMLCreateEdgeCommand.Argument.ArgumentBuilder<TElement, TSource, TTarget, ?, ?> b) {
         this.supplier = b.supplier;
         if (b.initName$set)
            this.initName = b.initName$value;
         else
            this.initName = UMLCreateEdgeCommand.Argument.<TElement, TSource, TTarget>$default$initName();
      }

      public static <TElement, TSource, TTarget> UMLCreateEdgeCommand.Argument.ArgumentBuilder<TElement, TSource, TTarget, ?, ?> createEdgeArgumentBuilder() {
         return new UMLCreateEdgeCommand.Argument.ArgumentBuilderImpl<TElement, TSource, TTarget>();
      }

      public BiFunction<TSource, TTarget, TElement> getSupplier() {
         return this.supplier;
      }

      public boolean isInitName() {
         return this.initName;
      }
   }

   public UMLCreateEdgeCommand(final BGEMFCommandContext context, final TSource source, final TTarget target,
         final TArgument argument) {
      super(context, context.modelState().getSemanticModel(), source, target, argument);
   }

   @Override
   protected TElement createElement(final TSource source, final TTarget target, final TArgument argument) {
      var element = argument.getSupplier().apply(source, target);
      if (element == null) {
         throw new GLSPServerException(String.format("[%s] Failed to create child for source %s and target %s",
               this.getClass().getSimpleName(), source.getClass().getSimpleName(), target.getClass().getSimpleName()));
      }
      if (argument.initName
            && (element instanceof NamedElement ne && (ne.getName() == null || ne.getName().isEmpty()))) {
         ne.setName(element.getClass().getSimpleName().replace("Impl", ""));
      }
      return element;
   }

   public TElement getElement() {
      return this.element;
   }
}
