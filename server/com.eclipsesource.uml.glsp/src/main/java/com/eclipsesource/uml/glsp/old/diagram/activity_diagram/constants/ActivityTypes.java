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
package com.eclipsesource.uml.glsp.old.diagram.activity_diagram.constants;

import java.util.List;

import com.eclipsesource.uml.glsp.core.utils.UmlConfig;

public final class ActivityTypes {
   // ACTIVITY DIAGRAM
   public static final String ICON_ACTIVITY = UmlConfig.Types.PRE_ICON + "activity";
   public static final String ACTIVITY = UmlConfig.Types.PRE_NODE + "activity";
   public static final String PARTITION = UmlConfig.Types.PRE_NODE + "partition";
   public static final String CONTROLFLOW = UmlConfig.Types.PRE_EDGE + "controlflow";
   public static final String LABEL_GUARD = UmlConfig.Types.PRE_LABEL + "guard";
   public static final String LABEL_WEIGHT = UmlConfig.Types.PRE_LABEL + "weight";
   public static final String CONDITION = UmlConfig.Types.PRE_NODE + "condition";
   public static final String ICON_ACTION = UmlConfig.Types.PRE_ICON + "action";
   public static final String ACTION = UmlConfig.Types.PRE_NODE + "action";
   public static final String SENDSIGNAL = UmlConfig.Types.PRE_NODE + "sendsignal";
   public static final String ACCEPTEVENT = UmlConfig.Types.PRE_NODE + "acceptevent";
   public static final String TIMEEVENT = UmlConfig.Types.PRE_NODE + "timeevent";
   public static final String CALL = UmlConfig.Types.PRE_NODE + "call";
   public static final String CALL_REF = UmlConfig.Types.PRE_LABEL + "callref";
   public static final List<String> ACTIONS = List.of(ACTION, SENDSIGNAL, ACCEPTEVENT, TIMEEVENT, CALL);
   public static final String INITIALNODE = UmlConfig.Types.PRE_NODE + "initialnode";
   public static final String FINALNODE = UmlConfig.Types.PRE_NODE + "finalnode";
   public static final String FLOWFINALNODE = UmlConfig.Types.PRE_NODE + "flowfinalnode";
   public static final String DECISIONMERGENODE = UmlConfig.Types.PRE_NODE + "decisionnode";
   public static final String FORKJOINNODE = UmlConfig.Types.PRE_NODE + "forknode";
   public static final List<String> CONTROL_NODES = List.of(INITIALNODE, FINALNODE, FLOWFINALNODE, DECISIONMERGENODE,
      FORKJOINNODE);
   public static final String PARAMETER = UmlConfig.Types.PRE_NODE + "parameter";
   public static final String PIN = UmlConfig.Types.PRE_NODE + "pin";
   public static final String PIN_PORT = UmlConfig.Types.PRE_NODE + "pinport";
   public static final String CENTRALBUFFER = UmlConfig.Types.PRE_NODE + "centralbuffer";
   public static final String DATASTORE = UmlConfig.Types.PRE_NODE + "datastore";
   public static final String EXCEPTIONHANDLER = UmlConfig.Types.PRE_EDGE + "exceptionhandler";
   public static final String INTERRUPTIBLEREGION = UmlConfig.Types.PRE_NODE + "interruptibleregion";

   // COMMON CANDIDATE
   public static final String STRUCTURE = "struct";

   private ActivityTypes() {}
}
