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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.destructionOccurrence;

import org.eclipse.uml2.uml.DestructionOccurrenceSpecification;
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteDestructionOccurreneSemanticCommand
   extends BaseDeleteSemanticChildCommand<Interaction, DestructionOccurrenceSpecification> {

   public DeleteDestructionOccurreneSemanticCommand(final ModelContext context,
      final DestructionOccurrenceSpecification semanticElement) {
      super(context, semanticElement.getEnclosingInteraction(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Interaction parent, final DestructionOccurrenceSpecification child) {
      parent.getFragments().remove(child);
   }
}
