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
package com.eclipsesource.uml.glsp.uml.statemachine_diagram;

import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.di.MultiBinding;
import org.eclipse.glsp.server.operations.OperationHandler;

import com.eclipsesource.uml.glsp.actions.UmlGetTypesActionHandler;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.actions.AddTransitionEffectActionHandler;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.actions.AddTransitionGuardActionHandler;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.actions.AddTransitionLabelActionHandler;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.actions.AddTransitionTriggerActionHandler;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.operations.CreateStateMachineDiagramChildNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.operations.CreateStateMachineDiagramEdgeOperationHandler;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.operations.CreateStateMachineDiagramNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.operations.CreateStateMachineDiagramStateChildNodeOperationHandler;

public class StateMachineGLSPModule {

   protected void configureActionHandlers(final MultiBinding<ActionHandler> bindings) {
      bindings.add(UmlGetTypesActionHandler.class);
      bindings.add(AddTransitionEffectActionHandler.class);
      bindings.add(AddTransitionGuardActionHandler.class);
      bindings.add(AddTransitionLabelActionHandler.class);
      bindings.add(AddTransitionTriggerActionHandler.class);
   }

   protected void configureOperationHandlers(final MultiBinding<OperationHandler> bindings) {
      // STATEMACHINE
      bindings.add(CreateStateMachineDiagramNodeOperationHandler.class);
      bindings.add(CreateStateMachineDiagramEdgeOperationHandler.class);
      bindings.add(CreateStateMachineDiagramChildNodeOperationHandler.class);
      bindings.add(CreateStateMachineDiagramStateChildNodeOperationHandler.class);
   }

}
