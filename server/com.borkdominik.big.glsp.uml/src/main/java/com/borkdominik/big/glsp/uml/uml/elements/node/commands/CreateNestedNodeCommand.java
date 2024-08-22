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
package com.borkdominik.big.glsp.uml.uml.elements.node.commands;

import org.eclipse.uml2.uml.Node;
import com.borkdominik.big.glsp.server.core.commands.emf.BGEMFCommandContext;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;

public class CreateNestedNodeCommand<TElement extends Node> extends UMLCreateNodeCommand<TElement, Node, CreateNestedNodeCommand.Argument<TElement>> {

   public static class Argument<TElement> extends UMLCreateNodeCommand.Argument<TElement, Node> {

      public static abstract class ArgumentBuilder<TElement, C extends CreateNestedNodeCommand.Argument<TElement>, B extends CreateNestedNodeCommand.Argument.ArgumentBuilder<TElement, C, B>> extends UMLCreateNodeCommand.Argument.ArgumentBuilder<TElement, Node, C, B> {
         @Override
         protected abstract B self();

         @Override
         public abstract C build();

         @Override
         public java.lang.String toString() {
            return "CreateNestedNodeCommand.Argument.ArgumentBuilder(super=" + super.toString() + ")";
         }
      }

      private static final class ArgumentBuilderImpl<TElement> extends CreateNestedNodeCommand.Argument.ArgumentBuilder<TElement, CreateNestedNodeCommand.Argument<TElement>, CreateNestedNodeCommand.Argument.ArgumentBuilderImpl<TElement>> {
         private ArgumentBuilderImpl() {
         }

         @Override
         protected CreateNestedNodeCommand.Argument.ArgumentBuilderImpl<TElement> self() {
            return this;
         }

         @Override
         public CreateNestedNodeCommand.Argument<TElement> build() {
            return new CreateNestedNodeCommand.Argument<TElement>(this);
         }
      }

      protected Argument(final CreateNestedNodeCommand.Argument.ArgumentBuilder<TElement, ?, ?> b) {
         super(b);
      }

      public static <TElement> CreateNestedNodeCommand.Argument.ArgumentBuilder<TElement, ?, ?> createNestedNodeArgumentBuilder() {
         return new CreateNestedNodeCommand.Argument.ArgumentBuilderImpl<TElement>();
      }
   }

   public CreateNestedNodeCommand(final BGEMFCommandContext context, final Node parent, final Argument<TElement> argument) {
      super(context, parent, argument);
   }

   @Override
   protected TElement createElement(final Node parent, final Argument<TElement> argument) {
      var element = super.createElement(parent, argument);
      if (!parent.getNestedNodes().contains(element)) {
         parent.getNestedNodes().add(element);
      }
      return element;
   }
}
