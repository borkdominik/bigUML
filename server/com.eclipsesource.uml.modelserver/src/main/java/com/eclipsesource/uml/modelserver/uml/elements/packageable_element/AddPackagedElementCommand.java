/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.elements.packageable_element;

import java.util.function.Function;
import java.util.function.Supplier;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class AddPackagedElementCommand
   extends BaseCreateSemanticChildCommand<Package, PackageableElement> {

   protected final Function<Package, PackageableElement> supplier;

   public AddPackagedElementCommand(final ModelContext context,
      final Package parent, final Supplier<PackageableElement> supplier) {
      this(context, parent, p -> supplier.get());
   }

   public AddPackagedElementCommand(final ModelContext context,
      final Package parent, final Function<Package, PackageableElement> supplier) {
      super(context, parent);
      this.supplier = supplier;
   }

   @Override
   protected PackageableElement createSemanticElement(final Package parent) {
      var element = supplier.apply(parent);
      var nameGenerator = new ListNameGenerator(element.getClass(), parent.allNamespaces());
      element.setName(nameGenerator.newName());
      parent.getPackagedElements().add(element);
      return element;
   }

}
