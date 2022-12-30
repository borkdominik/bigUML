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
import com.eclipsesource.uml.modelserver.shared.semantic.CreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.generator.EnumerationLiteralNameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.ContextualNameGenerator;

public final class AddEnumerationLiteralSemanticCommand
   extends CreateSemanticChildCommand<Enumeration, EnumerationLiteral> {

   protected final ContextualNameGenerator<Enumeration> nameGenerator;

   public AddEnumerationLiteralSemanticCommand(final ModelContext context,
      final Enumeration parent) {
      super(context, parent);
      this.nameGenerator = new EnumerationLiteralNameGenerator();
   }

   @Override
   protected EnumerationLiteral createSemanticElement(final Enumeration parent) {
      return parent.createOwnedLiteral(nameGenerator.newNameInContextOf(parent));
   }

}
