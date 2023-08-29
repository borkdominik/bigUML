/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.final_state;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.FinalState;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.reference.StateMachineDiagramCrossReferenceRemover;

public class DeleteFinalStateCompoundCommand extends CompoundCommand {

   public DeleteFinalStateCompoundCommand(final ModelContext context, final FinalState semanticElement) {
      this.append(new DeleteFinalStateSemanticCommand(context, semanticElement));

      new StateMachineDiagramCrossReferenceRemover(context).deleteCommandsFor(semanticElement)
         .forEach(this::append);
   }
}
