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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.substitution;

import org.eclipse.uml2.uml.Substitution;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public final class UpdateSubstitutionSemanticCommand
   extends BaseUpdateSemanticElementCommand<Substitution, UpdateSubstitutionArgument> {

   public UpdateSubstitutionSemanticCommand(final ModelContext context,
      final Substitution semanticElement,
      final UpdateSubstitutionArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Substitution semanticElement,
      final UpdateSubstitutionArgument updateArgument) {}

}
