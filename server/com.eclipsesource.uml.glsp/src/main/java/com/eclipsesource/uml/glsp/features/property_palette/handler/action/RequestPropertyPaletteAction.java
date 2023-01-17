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

import org.eclipse.glsp.server.actions.RequestAction;

public class RequestPropertyPaletteAction extends RequestAction<SetPropertyPaletteAction> {
   public static final String KIND = "requestPropertyPalette";

   private String elementId;

   public RequestPropertyPaletteAction() {
      super(KIND);
   }

   public RequestPropertyPaletteAction(final String elementId) {
      super(KIND);
      this.elementId = elementId;
   }

   public String getElementId() { return elementId; }

   public void setElementId(final String elementId) { this.elementId = elementId; }
}
