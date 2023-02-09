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

import org.eclipse.glsp.server.actions.ResponseAction;

public class SetEditorPanelAction extends ResponseAction {
   public static final String KIND = "setEditorPanel";

   private List<String> children;

   public SetEditorPanelAction() {
      super(KIND);
   }

   public SetEditorPanelAction(final List<String> children) {
      super(KIND);
      this.children = children;
   }

   public List<String> getChildren() { return children; }

   public void setChildren(final List<String> children) { this.children = children; }

}
