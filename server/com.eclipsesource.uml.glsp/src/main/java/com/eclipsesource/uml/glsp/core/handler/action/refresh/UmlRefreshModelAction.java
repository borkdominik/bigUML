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
package com.eclipsesource.uml.glsp.core.handler.action.refresh;

import org.eclipse.glsp.server.actions.Action;

/**
 * An action to trigger the refresh of the model from the ModelServer,
 * after we receive an update (incremental or full).
 */
public class UmlRefreshModelAction extends Action {

   public static final String KIND = "uml.refresh";
   public String reason;

   public UmlRefreshModelAction() {
      super(KIND);
   }

   public UmlRefreshModelAction(final String reason) {
      super(KIND);
      this.reason = reason;
   }
}
