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

public class ActionKind {
   private ActionKind() {}

   public static final String GET_TYPES = "getTypes";
   public static final String RETURN_TYPES = "returnTypes";

   // ACTIVITY
   public static final String GET_BEHAVIORS = "getBehaviors";
   public static final String CALL_BEHAVIORS = "callBehaviors";
   public static final String GUARD_CREATE = "createGuard";
   public static final String WEIGHT_CREATE = "createWeight";

   // STATE MACHINE
   public static final String ADD_TRANSITION_LABEL = "addTransitionLabel";
   public static final String ADD_TRANSITION_GUARD = "addTransitionGuard";
   public static final String ADD_TRANSITION_EFFECT = "addTransitionEffect";
   public static final String ADD_TRANSITION_TRIGGER = "addTransitionTrigger";

}
