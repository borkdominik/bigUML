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

public class ElementTextPropertyItem extends ElementPropertyItem {

   private final String text;

   public ElementTextPropertyItem(final String elementId, final String propertyId, final String text) {
      super(elementId, propertyId, ElementPropertyType.TEXT);

      this.text = text;
   }

   public String getText() { return text; }

}
