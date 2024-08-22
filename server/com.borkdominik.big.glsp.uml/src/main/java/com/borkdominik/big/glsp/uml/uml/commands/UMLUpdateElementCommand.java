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

public class UMLUpdateElementCommand<TElement extends EObject, TArgument extends UMLUpdateElementCommand.Argument<TElement>> extends BGUpdateElementSemanticCommand<TElement, TArgument> {

   public static class Argument<TElement> {
      protected Consumer<TElement> consumer;      public static abstract class ArgumentBuilder<TElement, C extends UMLUpdateElementCommand.Argument<TElement>, B extends UMLUpdateElementCommand.Argument.ArgumentBuilder<TElement, C, B>> {
         private Consumer<TElement> consumer;

         public B consumer(final Consumer<TElement> consumer) {
            this.consumer = consumer;
            return self();
         }

         protected abstract B self();

         public abstract C build();

         @Override
         public java.lang.String toString() {
            return "UMLUpdateElementCommand.Argument.ArgumentBuilder(consumer=" + this.consumer + ")";
         }
      }

      private static final class ArgumentBuilderImpl<TElement> extends UMLUpdateElementCommand.Argument.ArgumentBuilder<TElement, UMLUpdateElementCommand.Argument<TElement>, UMLUpdateElementCommand.Argument.ArgumentBuilderImpl<TElement>> {
         private ArgumentBuilderImpl() {
         }

         @Override
         protected UMLUpdateElementCommand.Argument.ArgumentBuilderImpl<TElement> self() {
            return this;
         }

         @Override
         public UMLUpdateElementCommand.Argument<TElement> build() {
            return new UMLUpdateElementCommand.Argument<TElement>(this);
         }
      }

      protected Argument(final UMLUpdateElementCommand.Argument.ArgumentBuilder<TElement, ?, ?> b) {
         this.consumer = b.consumer;
      }

      public static <TElement> UMLUpdateElementCommand.Argument.ArgumentBuilder<TElement, ?, ?> updateElementArgumentBuilder() {
         return new UMLUpdateElementCommand.Argument.ArgumentBuilderImpl<TElement>();
      }

      public Consumer<TElement> getConsumer() {
         return this.consumer;
      }
   }

   public UMLUpdateElementCommand(final BGCommandContext context, final EObject root, final TElement element, final TArgument argument) {
      super(context, root, element, argument);
   }

   @Override
   protected void updateElement(final TElement element, final TArgument argument) {
      argument.getConsumer().accept(element);
   }
}
