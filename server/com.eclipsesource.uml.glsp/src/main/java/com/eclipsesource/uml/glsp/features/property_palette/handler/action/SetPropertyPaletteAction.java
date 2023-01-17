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
package com.eclipsesource.uml.glsp.features.property_palette.handler.action;

import java.util.List;

import org.eclipse.glsp.server.actions.ResponseAction;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementPropertyItem;

public class SetPropertyPaletteAction extends ResponseAction {

   private List<ElementPropertyItem> propertyItems = List.of();

   public static final String KIND = "setPropertyPalette";

   public SetPropertyPaletteAction() {
      super(KIND);
   }

   public SetPropertyPaletteAction(final List<ElementPropertyItem> propertyItems) {
      super(KIND);
      this.propertyItems = propertyItems;
   }

   public List<ElementPropertyItem> getPropertyItems() { return propertyItems; }

   public void setPropertyItems(final List<ElementPropertyItem> propertyItems) { this.propertyItems = propertyItems; }

}
