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
   public final String elementId;
   public final String propertyId;
   public final String type;

   public ElementPropertyItem(final String elementId, final String propertyId, final ElementPropertyType type) {
      super();
      this.elementId = elementId;
      this.propertyId = propertyId;
      this.type = type.name();
   }

   protected ElementPropertyItem(final Builder builder, final ElementPropertyType type) {
      super();
      this.elementId = builder.elementId;
      this.propertyId = builder.propertyId;
      this.type = type.name();
   }

   public static abstract class Builder {
      protected final String elementId;
      protected final String propertyId;

      public Builder(final String elementId, final String propertyId) {
         super();
         this.elementId = elementId;
         this.propertyId = propertyId;
      }

      public abstract ElementPropertyItem build();
   }
}
