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
package com.eclipsesource.uml.glsp.actions;

import java.util.List;

import org.eclipse.glsp.server.actions.ResponseAction;

public class ReturnTypesAction extends ResponseAction {

   private List<String> types;

   public ReturnTypesAction() {
      super(ActionKind.RETURN_TYPES);
   }

   public ReturnTypesAction(final List<String> types) {
      super(ActionKind.RETURN_TYPES);
      this.types = types;
   }

   public List<String> getTypes() { return types; }

   public void setTypes(final List<String> types) { this.types = types; }
}
