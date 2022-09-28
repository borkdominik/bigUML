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
package com.eclipsesource.uml.glsp.uml.activity_diagram;

import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.di.MultiBinding;
import org.eclipse.glsp.server.operations.OperationHandler;

import com.eclipsesource.uml.glsp.actions.UmlGetTypesActionHandler;
import com.eclipsesource.uml.glsp.uml.activity_diagram.actions.behavior.CallBehaviorsAction;
import com.eclipsesource.uml.glsp.uml.activity_diagram.actions.edgelabels.CreateGuardActionHandler;
import com.eclipsesource.uml.glsp.uml.activity_diagram.actions.edgelabels.CreateWeightActionHandler;
import com.eclipsesource.uml.glsp.uml.activity_diagram.operations.CreateActivityDiagramChildNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.activity_diagram.operations.CreateActivityDiagramEdgeOperationHandler;
import com.eclipsesource.uml.glsp.uml.activity_diagram.operations.CreateActivityDiagramNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.common_diagram.operations.CreateCommentNodeOperationHandler;

public class ActivityGLSPModule {

   protected void configureActionHandlers(final MultiBinding<ActionHandler> bindings) {
      bindings.add(UmlGetTypesActionHandler.class);
      bindings.add(CreateGuardActionHandler.class);
      bindings.add(CreateWeightActionHandler.class);
   }

   protected void configureClientActions(final MultiBinding<Action> bindings) {
      bindings.add(CallBehaviorsAction.class);
   }

   protected void configureOperationHandlers(final MultiBinding<OperationHandler> bindings) {
      bindings.add(CreateActivityDiagramNodeOperationHandler.class);
      bindings.add(CreateActivityDiagramChildNodeOperationHandler.class);
      bindings.add(CreateActivityDiagramEdgeOperationHandler.class);
      bindings.add(CreateCommentNodeOperationHandler.class);
   }
}
