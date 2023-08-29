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
package com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.final_state;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Region;

import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_FinalState;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.final_state.CreateFinalStateContribution;

public class CreateFinalStateHandler extends BaseCreateChildNodeHandler<Region>
   implements CreateLocationAwareNodeHandler {

   public CreateFinalStateHandler() {
      super(UmlStateMachine_FinalState.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final Region parent) {
      return CreateFinalStateContribution.create(
         parent,
         relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)));
   }
}
