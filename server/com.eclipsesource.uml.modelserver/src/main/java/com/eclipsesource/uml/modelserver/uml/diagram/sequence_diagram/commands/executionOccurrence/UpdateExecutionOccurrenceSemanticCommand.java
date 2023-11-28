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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.executionOccurrence;

import org.eclipse.uml2.uml.OccurrenceSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public final class UpdateExecutionOccurrenceSemanticCommand
   extends BaseUpdateSemanticElementCommand<OccurrenceSpecification, UpdateExecutionOccurrenceArgument> {

   public UpdateExecutionOccurrenceSemanticCommand(final ModelContext context,
      final OccurrenceSpecification semanticElement,
      final UpdateExecutionOccurrenceArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final OccurrenceSpecification semanticElement,
      final UpdateExecutionOccurrenceArgument updateArgument) {
      updateArgument.name().ifPresent(arg -> {
         semanticElement.setName(arg);
      });

      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
      });
   }

}
