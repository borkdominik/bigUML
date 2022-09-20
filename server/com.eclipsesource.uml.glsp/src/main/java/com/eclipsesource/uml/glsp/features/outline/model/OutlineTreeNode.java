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
package com.eclipsesource.uml.glsp.features.outline.model;

import java.util.List;

public class OutlineTreeNode {
   private String label;
   private String semanticUri;
   private List<OutlineTreeNode> children;
   private String iconClass;

   public OutlineTreeNode(final String label, final String semanticUri, final List<OutlineTreeNode> children,
      final String iconClass) {
      super();
      this.label = label;
      this.semanticUri = semanticUri;
      this.children = children;
      this.iconClass = iconClass;
   }

   public String getLabel() { return label; }

   public void setLabel(final String label) { this.label = label; }

   public String getSemanticUri() { return semanticUri; }

   public void setSemanticUri(final String semanticUri) { this.semanticUri = semanticUri; }

   public List<OutlineTreeNode> getChildren() { return children; }

   public void setChildren(final List<OutlineTreeNode> children) { this.children = children; }

   public String getIconClass() { return iconClass; }

   public void setIconClass(final String iconClass) { this.iconClass = iconClass; }

}
