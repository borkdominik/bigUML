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
package com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.state;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.State;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_State;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state.UpdateStateArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state.UpdateStateContribution;

public class UpdateStateHandler
   extends BaseUpdateElementHandler<State, UpdateStateArgument> {

   public UpdateStateHandler() {
      super(UmlStateMachine_State.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final State element,
      final UpdateStateArgument updateArgument) {
      return UpdateStateContribution.create(element, updateArgument);
   }
}
