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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.behaviorExecution;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.BehaviorExecutionSpecification;
import org.eclipse.uml2.uml.ExecutionOccurrenceSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.executionOccurrence.DeleteExecutionOccurrenceCompoundCommand;

public final class DeleteBehaviorExecutionCompoundCommand extends CompoundCommand {
   public DeleteBehaviorExecutionCompoundCommand(final ModelContext context,
      final BehaviorExecutionSpecification semanticElement) {
      this.append(new DeleteBehaviorExecutionSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      this.append(new DeleteExecutionOccurrenceCompoundCommand(context,
         (ExecutionOccurrenceSpecification) semanticElement.getStart()));
      this.append(new DeleteExecutionOccurrenceCompoundCommand(context,
         (ExecutionOccurrenceSpecification) semanticElement.getFinish()));
   }
}
