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
package com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state_machine;

import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.StateMachine;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteStateMachineSemanticCommand extends BaseDeleteSemanticChildCommand<Model, StateMachine> {

   public DeleteStateMachineSemanticCommand(final ModelContext context, final StateMachine semanticElement) {
      super(context, semanticElement.getModel(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Model parent, final StateMachine child) {
      parent.getPackagedElements().remove(child);
   }
}
