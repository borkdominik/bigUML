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
package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.constants;

import java.util.Arrays;
import java.util.List;

import com.eclipsesource.uml.glsp.core.utils.UmlConfig;

public final class StateMachineTypes {

   // STATE MACHINE
   public static final String ICON_STATE_MACHINE = UmlConfig.Types.PRE_ICON + "state-machine";
   public static final String STATE_MACHINE = UmlConfig.Types.PRE_NODE + "state-machine";
   // public static final String REGION = COMP_BASE + "region";
   public static final String REGION = UmlConfig.Types.PRE_NODE + "region";
   public static final String ICON_STATE = UmlConfig.Types.PRE_ICON + "state";
   public static final String STATE = UmlConfig.Types.PRE_NODE + "state";
   public static final String FINAL_STATE = UmlConfig.Types.PRE_NODE + "final-state";
   public static final String STATE_ENTRY_ACTIVITY = UmlConfig.Types.PRE_NODE + "state-entry-activity";
   public static final String STATE_DO_ACTIVITY = UmlConfig.Types.PRE_NODE + "state-do-activity";
   public static final String STATE_EXIT_ACTIVITY = UmlConfig.Types.PRE_NODE + "state-exit-activity";
   // Pseudostates
   public static final String ICON_INITIAL_STATE = UmlConfig.Types.PRE_ICON + "initial-state";
   public static final String INITIAL_STATE = UmlConfig.Types.PRE_NODE + "initial-state";
   public static final String LABEL_VERTEX_NAME = UmlConfig.Types.PRE_LABEL + "vertex-name";
   public static final String DEEP_HISTORY = UmlConfig.Types.PRE_NODE + "deep-history";
   public static final String SHALLOW_HISTORY = UmlConfig.Types.PRE_NODE + "shallow-history";
   public static final String JOIN = UmlConfig.Types.PRE_NODE + "join";
   public static final String FORK = UmlConfig.Types.PRE_NODE + "fork";
   public static final String JUNCTION = UmlConfig.Types.PRE_NODE + "junction";
   public static final String CHOICE = UmlConfig.Types.PRE_NODE + "choice";
   public static final String ENTRY_POINT = UmlConfig.Types.PRE_NODE + "entry-point";
   public static final String EXIT_POINT = UmlConfig.Types.PRE_NODE + "exit-point";
   public static final String TERMINATE = UmlConfig.Types.PRE_NODE + "terminate";

   public static final String TRANSITION = UmlConfig.Types.PRE_EDGE + "transition";
   public static final String LABEL_TRANSITION_NAME = UmlConfig.Types.PRE_LABEL + "transition-name";
   public static final String LABEL_TRANSITION_GUARD = UmlConfig.Types.PRE_LABEL + "transition-guard";
   public static final String LABEL_TRANSITION_EFFECT = UmlConfig.Types.PRE_LABEL + "transition-effect";
   public static final String LABEL_TRANSITION_TRIGGER = UmlConfig.Types.PRE_LABEL + "transition-trigger";
   public static final List<String> PSEUDOSTATES = Arrays.asList(INITIAL_STATE, DEEP_HISTORY, SHALLOW_HISTORY, JOIN,
      FORK, JUNCTION, CHOICE, ENTRY_POINT, EXIT_POINT, TERMINATE);

   // COMMON CANDIDATE
   public static final String STRUCTURE = "struct";

   private StateMachineTypes() {}
}
