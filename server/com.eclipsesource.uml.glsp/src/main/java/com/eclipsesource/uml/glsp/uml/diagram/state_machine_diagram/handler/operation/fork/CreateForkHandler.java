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
package com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.fork;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.PseudostateKind;
import org.eclipse.uml2.uml.Region;

import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Fork;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.pseudostate.CreatePseudoStateContribution;

public class CreateForkHandler extends BaseCreateChildNodeHandler<Region>
   implements CreateLocationAwareNodeHandler {

   public CreateForkHandler() {
      super(UmlStateMachine_Fork.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final Region parent) {
      return CreatePseudoStateContribution.create(
         parent,
         relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)), PseudostateKind.FORK_LITERAL);
   }
}
