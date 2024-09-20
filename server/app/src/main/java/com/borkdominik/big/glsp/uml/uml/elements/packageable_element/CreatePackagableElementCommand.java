/********************************************************************************
 * Copyright (c) 2021 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.packageable_element;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageableElement;
import com.borkdominik.big.glsp.server.core.commands.emf.BGEMFCommandContext;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;

public class CreatePackagableElementCommand<TElement extends PackageableElement> extends UMLCreateNodeCommand<TElement, Package, CreatePackagableElementCommand.Argument<TElement>> {

   public static class Argument<TElement> extends UMLCreateNodeCommand.Argument<TElement, Package> {

      public static abstract class ArgumentBuilder<TElement, C extends CreatePackagableElementCommand.Argument<TElement>, B extends CreatePackagableElementCommand.Argument.ArgumentBuilder<TElement, C, B>> extends UMLCreateNodeCommand.Argument.ArgumentBuilder<TElement, Package, C, B> {
         @Override
         protected abstract B self();

         @Override
         public abstract C build();

         @Override
         public java.lang.String toString() {
            return "CreatePackagableElementCommand.Argument.ArgumentBuilder(super=" + super.toString() + ")";
         }
      }

      private static final class ArgumentBuilderImpl<TElement> extends CreatePackagableElementCommand.Argument.ArgumentBuilder<TElement, CreatePackagableElementCommand.Argument<TElement>, CreatePackagableElementCommand.Argument.ArgumentBuilderImpl<TElement>> {
         private ArgumentBuilderImpl() {
         }

         @Override
         protected CreatePackagableElementCommand.Argument.ArgumentBuilderImpl<TElement> self() {
            return this;
         }

         @Override
         public CreatePackagableElementCommand.Argument<TElement> build() {
            return new CreatePackagableElementCommand.Argument<TElement>(this);
         }
      }

      protected Argument(final CreatePackagableElementCommand.Argument.ArgumentBuilder<TElement, ?, ?> b) {
         super(b);
      }

      public static <TElement> CreatePackagableElementCommand.Argument.ArgumentBuilder<TElement, ?, ?> createPackageableElementArgumentBuilder() {
         return new CreatePackagableElementCommand.Argument.ArgumentBuilderImpl<TElement>();
      }
   }

   public CreatePackagableElementCommand(final BGEMFCommandContext context, final Package parent, final Argument<TElement> argument) {
      super(context, parent, argument);
   }

   @Override
   protected TElement createElement(final Package parent, final Argument<TElement> argument) {
      var element = super.createElement(parent, argument);
      if (!parent.getPackagedElements().contains(element)) {
         parent.getPackagedElements().add(element);
      }
      return element;
   }
}
