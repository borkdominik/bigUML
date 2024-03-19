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

import lombok.Getter;
import lombok.experimental.SuperBuilder;

public final class CreatePackagableElementCommand<TElement extends PackageableElement>
   extends UMLCreateNodeCommand<TElement, Package, CreatePackagableElementCommand.Argument<TElement>> {

   @Getter
   @SuperBuilder(builderMethodName = "createPackageableElementArgumentBuilder")
   public static class Argument<TElement> extends UMLCreateNodeCommand.Argument<TElement, Package> {

   }

   public CreatePackagableElementCommand(final BGEMFCommandContext context, final Package parent,
      final Argument<TElement> argument) {
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
