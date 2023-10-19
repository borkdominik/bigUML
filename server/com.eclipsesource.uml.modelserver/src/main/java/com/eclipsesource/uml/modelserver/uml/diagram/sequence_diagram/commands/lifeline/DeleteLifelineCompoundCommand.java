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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.lifeline;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.BehaviorExecutionSpecification;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.behaviorExecution.DeleteBehaviorExecutionCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.message.DeleteMessageCompoundCommand;

public final class DeleteLifelineCompoundCommand extends CompoundCommand {
   public DeleteLifelineCompoundCommand(final ModelContext context, final Lifeline semanticElement) {

      semanticElement.getCoveredBys().stream()
         .filter(c -> c instanceof MessageOccurrenceSpecification)
         .map(o -> ((MessageOccurrenceSpecification) o).getMessage())
         .filter(o -> o != null)
         .distinct()
         .map(m -> new DeleteMessageCompoundCommand(context, m))
         .forEach(c -> this.append(c));

      semanticElement.getCoveredBys().stream()
         .filter(f -> f instanceof BehaviorExecutionSpecification)
         .map(e -> new DeleteBehaviorExecutionCompoundCommand(context, (BehaviorExecutionSpecification) e))
         .forEach(c -> this.append(c));

      this.append(new DeleteLifelineSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));
   }
}
