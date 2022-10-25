/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.old.diagram.activity_diagram.actions.edgelabels;

import org.eclipse.glsp.server.actions.ResponseAction;

public class CreateGuardAction extends ResponseAction {
   public static final String TYPE = "createGuard";

   private String elementTypeId;

   public CreateGuardAction() {
      super(TYPE);
   }

   public CreateGuardAction(final String elementTypeId) {
      super(TYPE);
      this.elementTypeId = elementTypeId;
   }

   public String getElementTypeId() { return elementTypeId; }

   public void setElementTypeId(final String elementTypeId) { this.elementTypeId = elementTypeId; }

}
