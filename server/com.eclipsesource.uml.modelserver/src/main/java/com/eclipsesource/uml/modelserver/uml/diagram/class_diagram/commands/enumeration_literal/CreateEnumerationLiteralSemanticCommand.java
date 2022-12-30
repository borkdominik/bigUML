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
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateEnumerationLiteralSemanticCommand
   extends BaseCreateSemanticChildCommand<Enumeration, EnumerationLiteral> {

   public CreateEnumerationLiteralSemanticCommand(final ModelContext context,
      final Enumeration parent) {
      super(context, parent);
   }

   @Override
   protected EnumerationLiteral createSemanticElement(final Enumeration parent) {
      var nameGenerator = new ListNameGenerator(EnumerationLiteral.class, parent.getOwnedLiterals());

      return parent.createOwnedLiteral(nameGenerator.newName());
   }

}
