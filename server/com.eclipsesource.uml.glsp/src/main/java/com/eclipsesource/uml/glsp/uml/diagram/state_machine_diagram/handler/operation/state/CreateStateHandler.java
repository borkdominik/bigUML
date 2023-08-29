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
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.RedefinableElement;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.State;

import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_State;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state.CreateStateContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state.sub_state.CreateSubStateContribution;

public class CreateStateHandler extends BaseCreateChildNodeHandler<RedefinableElement>
   implements CreateLocationAwareNodeHandler {

   public CreateStateHandler() {
      super(UmlStateMachine_State.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final RedefinableElement parent) {

      if (parent instanceof State) {
         return CreateSubStateContribution.create(
            (State) parent,
            relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)));
      }
      return CreateStateContribution.create(
         (Region) parent,
         relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)));

   }
}
