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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration_literal;

import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.EnumerationLiteral;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.DeleteSemanticChildCommand;

public final class RemoveEnumerationLiteralSemanticCommand
   extends DeleteSemanticChildCommand<Enumeration, EnumerationLiteral> {

   public RemoveEnumerationLiteralSemanticCommand(final ModelContext context,
      final Enumeration parent,
      final EnumerationLiteral semanticElement) {
      super(context, parent, semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Enumeration parent, final EnumerationLiteral child) {
      parent.getOwnedLiterals().remove(child);
   }

}
