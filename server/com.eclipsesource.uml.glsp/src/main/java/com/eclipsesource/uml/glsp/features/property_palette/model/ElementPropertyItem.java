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
package com.eclipsesource.uml.glsp.features.property_palette.model;

public abstract class ElementPropertyItem {
   private final String elementId;
   private final String propertyId;
   private final ElementPropertyType type;

   public ElementPropertyItem(final String elementId, final String propertyId, final ElementPropertyType type) {
      super();
      this.elementId = elementId;
      this.propertyId = propertyId;
      this.type = type;
   }

   public String getElementId() { return elementId; }

   public String getPropertyId() { return propertyId; }

   public ElementPropertyType getType() { return type; }

}
