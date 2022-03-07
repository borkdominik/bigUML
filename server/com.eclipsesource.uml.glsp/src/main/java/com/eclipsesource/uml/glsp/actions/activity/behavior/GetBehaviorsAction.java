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
package com.eclipsesource.uml.glsp.actions.activity.behavior;

import org.eclipse.glsp.server.actions.RequestAction;

import com.eclipsesource.uml.glsp.actions.ActionKind;

public class GetBehaviorsAction extends RequestAction<CallBehaviorsAction> {

   public GetBehaviorsAction() {
      super(ActionKind.GET_BEHAVIORS);
   }

}
