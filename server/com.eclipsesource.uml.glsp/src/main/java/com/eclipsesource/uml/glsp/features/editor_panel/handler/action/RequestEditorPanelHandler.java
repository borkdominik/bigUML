/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.features.editor_panel.handler.action;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.server.actions.AbstractActionHandler;
import org.eclipse.glsp.server.actions.Action;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.google.inject.Inject;

public class RequestEditorPanelHandler extends AbstractActionHandler<RequestEditorPanelAction> {

   private static final Logger LOG = LogManager.getLogger(RequestEditorPanelHandler.class);

   @Inject
   protected UmlModelState modelState;

   @Override
   protected List<Action> executeAction(final RequestEditorPanelAction action) {
      return modelState.getRepresentation().map(representation -> {
         return List.<Action> of(new SetEditorPanelAction(List.of("property-palette")));
      }).orElse(List.of(new SetEditorPanelAction()));
   }
}
