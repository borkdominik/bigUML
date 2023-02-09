/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.features.property_palette.model;

import java.util.List;

public class PropertyPalette {
   protected String elementId;
   protected String label;
   protected List<ElementPropertyItem> items;

   public PropertyPalette(final String elementId, final String label, final List<ElementPropertyItem> items) {
      super();
      this.elementId = elementId;
      this.label = label;
      this.items = items;
   }

   public String getElementId() { return elementId; }

   public String getLabel() { return label; }

   public List<ElementPropertyItem> getItems() { return items; }

}
