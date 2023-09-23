/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.elements.primitive_type.commands;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreatePrimitiveTypeSemanticCommand extends BaseCreateSemanticChildCommand<Package, PrimitiveType> {

   public CreatePrimitiveTypeSemanticCommand(final ModelContext context, final Package parent) {
      super(context, parent);
   }

   @Override
   protected PrimitiveType createSemanticElement(final Package parent) {
      var nameGenerator = new ListNameGenerator(PrimitiveType.class, parent.getPackagedElements());

      return parent.createOwnedPrimitiveType(nameGenerator.newName());
   }

}
