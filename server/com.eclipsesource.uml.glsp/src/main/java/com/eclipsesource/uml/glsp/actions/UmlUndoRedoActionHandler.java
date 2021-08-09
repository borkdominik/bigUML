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

import org.apache.log4j.Logger;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.features.undoredo.RedoAction;
import org.eclipse.glsp.server.features.undoredo.UndoAction;
import org.eclipse.glsp.server.model.GModelState;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.google.common.collect.Lists;

public class UmlUndoRedoActionHandler implements ActionHandler {
   private static final Logger LOGGER = Logger.getLogger(UmlUndoRedoActionHandler.class.getSimpleName());

   @Override
   public List<Action> execute(final Action action, final GModelState modelState) {
      UmlModelServerAccess modelServerAccess = UmlModelState.getModelServerAccess(modelState);
      boolean success = executeOperation(action, modelServerAccess);
      if (!success) {
         LOGGER.warn("Cannot undo or redo");
      }
      return List.of();
   }

   private boolean executeOperation(final Action action, final UmlModelServerAccess modelServerAccess) {
      if (action instanceof UndoAction) {
         return modelServerAccess.undo();
      } else if (action instanceof RedoAction) {
         return modelServerAccess.redo();
      }
      return false;
   }

   @Override
   public List<Class<? extends Action>> getHandledActionTypes() {
      return Lists.newArrayList(UndoAction.class, RedoAction.class);
   }
}
