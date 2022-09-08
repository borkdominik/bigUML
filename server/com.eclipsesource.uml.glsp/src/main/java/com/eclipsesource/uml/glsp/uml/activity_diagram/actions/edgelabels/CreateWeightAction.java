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
package com.eclipsesource.uml.glsp.uml.activity_diagram.actions.edgelabels;

import org.eclipse.glsp.server.actions.ResponseAction;

import com.eclipsesource.uml.glsp.actions.ActionKind;

public class CreateWeightAction extends ResponseAction {

   private String elementTypeId;

   public CreateWeightAction() {
      super(ActionKind.WEIGHT_CREATE);
   }

   public CreateWeightAction(final String elementTypeId) {
      super(ActionKind.WEIGHT_CREATE);
      this.elementTypeId = elementTypeId;
   }

   public String getElementTypeId() { return elementTypeId; }

   public void setElementTypeId(final String elementTypeId) { this.elementTypeId = elementTypeId; }

}
