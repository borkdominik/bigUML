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

import java.util.ArrayList;
import java.util.List;

public class ElementPropertyBuilder {
   private final String elementId;
   private final List<ElementPropertyItem> items = new ArrayList<>();

   public ElementPropertyBuilder(final String elementId) {
      this.elementId = elementId;
   }

   public ElementPropertyBuilder textProperty(final String propertyId, final String value) {
      items.add(new ElementTextPropertyItem(elementId, propertyId, value));
      return this;
   }

   public List<ElementPropertyItem> items() {
      return items;
   }
}
