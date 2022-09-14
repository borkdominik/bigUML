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
package com.eclipsesource.uml.glsp.actions;

import java.util.List;

import org.eclipse.glsp.server.actions.ResponseAction;

import com.eclipsesource.uml.glsp.outline.OutlineTreeNode;

public class SetOutlineAction extends ResponseAction {

   private List<OutlineTreeNode> outlineTreeNodes = List.of();

   public static final String KIND = "setOutlineAction";

   public SetOutlineAction() {
      super(KIND);
   }

   public SetOutlineAction(final List<OutlineTreeNode> outlineTreeNodes) {
      super(KIND);
      this.outlineTreeNodes = outlineTreeNodes;
   }

   public List<OutlineTreeNode> getOutlineTreeNodes() { return outlineTreeNodes; }

   public void setOutlineTreeNodes(final List<OutlineTreeNode> outlineTreeNodes) {
      this.outlineTreeNodes = outlineTreeNodes;
   }

}
