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
package com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.transition;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Transition;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Transition;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.transition.UpdateTransitionArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.transition.UpdateTransitionContribution;

public class UpdateTransitionHandler
   extends BaseUpdateElementHandler<Transition, UpdateTransitionArgument> {

   public UpdateTransitionHandler() {
      super(UmlStateMachine_Transition.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Transition element,
      final UpdateTransitionArgument updateArgument) {
      return UpdateTransitionContribution.create(element, updateArgument);
   }
}
