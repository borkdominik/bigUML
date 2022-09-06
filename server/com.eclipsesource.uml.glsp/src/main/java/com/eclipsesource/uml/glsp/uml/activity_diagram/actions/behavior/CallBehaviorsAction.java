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
package com.eclipsesource.uml.glsp.uml.activity_diagram.actions.behavior;

import java.util.List;

import org.eclipse.glsp.server.actions.ResponseAction;

import com.eclipsesource.uml.glsp.actions.ActionKind;

public class CallBehaviorsAction extends ResponseAction {

   private List<String> behaviors;

   public CallBehaviorsAction() {
      super(ActionKind.CALL_BEHAVIORS);
   }

   public CallBehaviorsAction(final List<String> behaviors) {
      super(ActionKind.CALL_BEHAVIORS);
      this.behaviors = behaviors;
   }

   public List<String> getBehaviors() { return behaviors; }

   public void setBehaviors(final List<String> behaviors) { this.behaviors = behaviors; }

}
