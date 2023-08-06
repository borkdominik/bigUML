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
   protected String label;
   protected String semanticUri;
   protected List<OutlineTreeNode> children;
   protected String iconClass;
   protected Boolean isRoot;

   public OutlineTreeNode(final String label, final String semanticUri, final List<OutlineTreeNode> children,
      final String iconClass) {
      this(label, semanticUri, children, iconClass, false);
   }

   public OutlineTreeNode(final String label, final String semanticUri, final List<OutlineTreeNode> children,
      final String iconClass,
      final Boolean isRoot) {
      super();
      this.label = label;
      this.semanticUri = semanticUri;
      this.children = children;
      this.iconClass = iconClass;
      this.isRoot = isRoot;
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
