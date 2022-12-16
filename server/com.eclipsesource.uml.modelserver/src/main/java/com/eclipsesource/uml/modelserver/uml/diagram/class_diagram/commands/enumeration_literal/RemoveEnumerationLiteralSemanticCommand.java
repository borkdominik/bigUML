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
import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemoveEnumerationLiteralSemanticCommand extends UmlSemanticElementCommand {

   protected final Enumeration parent;
   protected final EnumerationLiteral literal;

   public RemoveEnumerationLiteralSemanticCommand(final ModelContext context,
      final Enumeration parent,
      final EnumerationLiteral literal) {
      super(context);
      this.parent = parent;
      this.literal = literal;
   }

   @Override
   protected void doExecute() {
      parent.getOwnedLiterals().remove(literal);
   }

}
