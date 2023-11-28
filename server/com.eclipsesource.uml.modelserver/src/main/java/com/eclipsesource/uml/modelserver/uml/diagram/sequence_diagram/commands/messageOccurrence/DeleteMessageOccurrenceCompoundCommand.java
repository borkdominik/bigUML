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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.messageOccurrence;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.BehaviorExecutionSpecification;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.behaviorExecution.DeleteBehaviorExecutionCompoundCommand;

public final class DeleteMessageOccurrenceCompoundCommand extends CompoundCommand {
   public DeleteMessageOccurrenceCompoundCommand(final ModelContext context,
      final MessageOccurrenceSpecification semanticElement) {
      deleteReferencingExecutionSpecification(context, semanticElement);

      this.append(new DeleteMessageOccurreneSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      // new SequenceDiagramCrossReferenceRemover(context)
      // .deleteCommandsFor(semanticElement)
      // .forEach(this::append);
   }

   private void deleteReferencingExecutionSpecification(
      final ModelContext context,
      final MessageOccurrenceSpecification semanticElement) {
      semanticElement.getEnclosingInteraction()
         .getFragments()
         .stream()
         .filter(f -> f instanceof BehaviorExecutionSpecification)
         .map(b -> ((BehaviorExecutionSpecification) b))
         .filter(b -> b.getStart() == semanticElement
            || b.getFinish() == semanticElement)
         .forEach(b -> this
            .append(new DeleteBehaviorExecutionCompoundCommand(context, (b))));
   }
}
