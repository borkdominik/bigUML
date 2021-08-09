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
package com.eclipsesource.uml.glsp.actions;

import java.util.List;

import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.DisposeClientSessionAction;
import org.eclipse.glsp.server.actions.DisposeClientSessionActionHandler;
import org.eclipse.glsp.server.model.GModelState;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;

public class UmlDisposeClientSessionActionHandler extends DisposeClientSessionActionHandler {

   @Override
   protected List<Action> executeAction(final DisposeClientSessionAction action,
      final GModelState graphicalModelState) {
      // Unsubscribe from ModelServer updates
      UmlModelServerAccess modelServerAccess = UmlModelState.getModelServerAccess(graphicalModelState);
      modelServerAccess.unsubscribe();
      return super.executeAction(action, graphicalModelState);
   }

}
