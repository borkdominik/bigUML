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

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;

public final class DeleteBehaviorExecutionCompoundCommand extends CompoundCommand {
   public DeleteBehaviorExecutionCompoundCommand(final ModelContext context,
      final BehaviorExecutionSpecification semanticElement) {
      this.append(new DeleteBehaviorExecutionSemanticCommand(context, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));

      // if (semanticElement.getStart() != null) {
      // this.append(new DeleteExecutionOccurrenceCompoundCommand(context,
      // (ExecutionOccurrenceSpecification) semanticElement.getStart()));
      // }
      // if (semanticElement.getFinish() != null) {
      // this.append(new DeleteExecutionOccurrenceCompoundCommand(context,
      // (ExecutionOccurrenceSpecification) semanticElement.getFinish()));
      // }
   }
}
