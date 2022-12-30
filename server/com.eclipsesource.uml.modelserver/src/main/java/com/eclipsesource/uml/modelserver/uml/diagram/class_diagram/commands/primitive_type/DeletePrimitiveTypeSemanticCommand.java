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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.primitive_type;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeletePrimitiveTypeSemanticCommand extends BaseDeleteSemanticChildCommand<Package, PrimitiveType> {

   public DeletePrimitiveTypeSemanticCommand(final ModelContext context,
      final Package parent,
      final PrimitiveType semanticElement) {
      super(context, parent, semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final PrimitiveType child) {
      parent.getPackagedElements().remove(child);
   }
}
