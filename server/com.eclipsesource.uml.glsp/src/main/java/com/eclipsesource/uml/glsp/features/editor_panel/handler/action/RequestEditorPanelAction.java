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

import org.eclipse.glsp.server.actions.RequestAction;

public class RequestEditorPanelAction extends RequestAction<SetEditorPanelAction> {
   public static final String KIND = "requestEditorPanel";

   public RequestEditorPanelAction() {
      super(KIND);
   }
}
