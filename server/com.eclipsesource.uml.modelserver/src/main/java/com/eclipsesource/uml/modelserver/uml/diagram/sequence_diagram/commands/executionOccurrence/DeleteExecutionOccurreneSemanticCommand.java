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

import org.eclipse.uml2.uml.ExecutionOccurrenceSpecification;
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteExecutionOccurreneSemanticCommand
   extends BaseDeleteSemanticChildCommand<Interaction, ExecutionOccurrenceSpecification> {

   public DeleteExecutionOccurreneSemanticCommand(final ModelContext context,
      final ExecutionOccurrenceSpecification semanticElement) {
      super(context, semanticElement.getEnclosingInteraction(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Interaction parent, final ExecutionOccurrenceSpecification child) {
      parent.getFragments().remove(child);
   }
}
