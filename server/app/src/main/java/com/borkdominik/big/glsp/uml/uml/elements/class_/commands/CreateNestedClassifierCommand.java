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

public class CreateNestedClassifierCommand<TElement extends Classifier> extends UMLCreateNodeCommand<TElement, Class, CreateNestedClassifierCommand.Argument<TElement>> {

   public static class Argument<TElement> extends UMLCreateNodeCommand.Argument<TElement, Class> {

      public static abstract class ArgumentBuilder<TElement, C extends CreateNestedClassifierCommand.Argument<TElement>, B extends CreateNestedClassifierCommand.Argument.ArgumentBuilder<TElement, C, B>> extends UMLCreateNodeCommand.Argument.ArgumentBuilder<TElement, Class, C, B> {
         @Override
         protected abstract B self();

         @Override
         public abstract C build();

         @Override
         public java.lang.String toString() {
            return "CreateNestedClassifierCommand.Argument.ArgumentBuilder(super=" + super.toString() + ")";
         }
      }

      private static final class ArgumentBuilderImpl<TElement> extends CreateNestedClassifierCommand.Argument.ArgumentBuilder<TElement, CreateNestedClassifierCommand.Argument<TElement>, CreateNestedClassifierCommand.Argument.ArgumentBuilderImpl<TElement>> {
         private ArgumentBuilderImpl() {
         }

         @Override
         protected CreateNestedClassifierCommand.Argument.ArgumentBuilderImpl<TElement> self() {
            return this;
         }

         @Override
         public CreateNestedClassifierCommand.Argument<TElement> build() {
            return new CreateNestedClassifierCommand.Argument<TElement>(this);
         }
      }

      protected Argument(final CreateNestedClassifierCommand.Argument.ArgumentBuilder<TElement, ?, ?> b) {
         super(b);
      }

      public static <TElement> CreateNestedClassifierCommand.Argument.ArgumentBuilder<TElement, ?, ?> createNestedClassifierArgumentBuilder() {
         return new CreateNestedClassifierCommand.Argument.ArgumentBuilderImpl<TElement>();
      }
   }

   public CreateNestedClassifierCommand(final BGEMFCommandContext context, final Class parent, final Argument<TElement> argument) {
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
