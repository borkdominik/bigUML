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

public class UMLCreateNodeCommand<TElement extends EObject, TParent extends EObject, TArgument extends UMLCreateNodeCommand.Argument<TElement, TParent>>
      extends BGCreateNodeSemanticCommand<TElement, TParent, TArgument> {

   public static class Argument<TElement, TParent> {
      protected Function<TParent, TElement> supplier;
      protected boolean initName;

      private static <TElement, TParent> boolean $default$initName() {
         return true;
      }

      public static abstract class ArgumentBuilder<TElement, TParent, C extends UMLCreateNodeCommand.Argument<TElement, TParent>, B extends UMLCreateNodeCommand.Argument.ArgumentBuilder<TElement, TParent, C, B>> {
         private Function<TParent, TElement> supplier;
         private boolean initName$set;
         private boolean initName$value;

         public B supplier(final Function<TParent, TElement> supplier) {
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
            return "UMLCreateNodeCommand.Argument.ArgumentBuilder(supplier=" + this.supplier + ", initName$value="
                  + this.initName$value + ")";
         }
      }

      private static final class ArgumentBuilderImpl<TElement, TParent> extends
            UMLCreateNodeCommand.Argument.ArgumentBuilder<TElement, TParent, UMLCreateNodeCommand.Argument<TElement, TParent>, UMLCreateNodeCommand.Argument.ArgumentBuilderImpl<TElement, TParent>> {
         private ArgumentBuilderImpl() {
         }

         @Override
         protected UMLCreateNodeCommand.Argument.ArgumentBuilderImpl<TElement, TParent> self() {
            return this;
         }

         @Override
         public UMLCreateNodeCommand.Argument<TElement, TParent> build() {
            return new UMLCreateNodeCommand.Argument<TElement, TParent>(this);
         }
      }

      protected Argument(final UMLCreateNodeCommand.Argument.ArgumentBuilder<TElement, TParent, ?, ?> b) {
         this.supplier = b.supplier;
         if (b.initName$set)
            this.initName = b.initName$value;
         else
            this.initName = UMLCreateNodeCommand.Argument.<TElement, TParent>$default$initName();
      }

      public static <TElement, TParent> UMLCreateNodeCommand.Argument.ArgumentBuilder<TElement, TParent, ?, ?> createChildArgumentBuilder() {
         return new UMLCreateNodeCommand.Argument.ArgumentBuilderImpl<TElement, TParent>();
      }

      public Function<TParent, TElement> getSupplier() {
         return this.supplier;
      }

      public boolean isInitName() {
         return this.initName;
      }
   }

   public UMLCreateNodeCommand(final BGEMFCommandContext context, final TParent parent, final TArgument argument) {
      super(context, context.modelState().getSemanticModel(), parent, argument);
   }

   @Override
   protected TElement createElement(final TParent parent, final TArgument argument) {
      var element = argument.getSupplier().apply(parent);
      if (element == null) {
         throw new GLSPServerException(String.format("[%s] Failed to create child for parent %s",
               this.getClass().getSimpleName(), parent.getClass().getSimpleName()));
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
