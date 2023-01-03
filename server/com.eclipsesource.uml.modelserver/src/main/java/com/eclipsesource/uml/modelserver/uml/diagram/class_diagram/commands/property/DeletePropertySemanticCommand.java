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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property;

import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeletePropertySemanticCommand extends BaseDeleteSemanticChildCommand<AttributeOwner, Property> {

   public DeletePropertySemanticCommand(final ModelContext context, final Property semanticElement) {
      super(context, (AttributeOwner) semanticElement.getOwner(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final AttributeOwner parent, final Property child) {
      parent.getOwnedAttributes().remove(child);
   }
}
