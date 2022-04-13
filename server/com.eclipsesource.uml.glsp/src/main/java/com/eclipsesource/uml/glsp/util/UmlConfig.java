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
package com.eclipsesource.uml.glsp.util;

import java.util.Arrays;
import java.util.List;

public final class UmlConfig {

   public static final class Types {

      // NEW LABELS
      public static final String LABEL_COMP = "comp:label";
      public static final String COMPARTMENT = "comp";
      public static final String COMPARTMENT_HEADER = "comp:header";
      public static final String PROPERTY = "comp:property";
      public static final String ICON_PROPERTY = "icon:property";
      public static final String LABEL_PROPERTY_NAME = "label:property:name";
      public static final String LABEL_PROPERTY_TYPE = "label:property:type";
      public static final String LABEL_PROPERTY_MULTIPLICITY = "label:property:multiplicity";

      // PREFIXES
      public static final String NODE = "node:";
      public static final String EDGE = "edge:";
      public static final String LABEL = "label:";
      public static final String COMP_BASE = "comp:";
      public static final String ICON = "icon:";

      // COMMONS
      public static final String LABEL_NAME = LABEL + "name";
      public static final String LABEL_TEXT = LABEL + "text";
      public static final String LABEL_EDGE_NAME = LABEL + "edge-name";
      public static final String LABEL_EDGE_MULTIPLICITY = LABEL + "edge-multiplicity";
      public static final String COMP = COMP_BASE + "comp";
      // public static final String COMP_HEADER = COMP_BASE + "header";
      public static final String LABEL_ICON = LABEL + "icon";

      // CLASS DIAGRAM
      public static final String ICON_CLASS = ICON + "class";
      public static final String CLASS = NODE + "class";
      public static final String INTERFACE = NODE + "interface";
      //public static final String PROPERTY = NODE + "property";
      public static final String ASSOCIATION = EDGE + "association";
      public static final String CLASS_GENERALIZATION = EDGE + "class-generalization";

      // OBJECT DIAGRAM
      public static final String ICON_OBJECT = ICON + "object";
      public static final String OBJECT = NODE + "object";
      public static final String ATTRIBUTE = NODE + "attribute";
      public static final String LINK = EDGE + "link";

      // ACTIVITY DIAGRAM
      public static final String ICON_ACTIVITY = ICON + "activity";
      public static final String ACTIVITY = NODE + "activity";
      public static final String PARTITION = NODE + "partition";
      public static final String CONTROLFLOW = EDGE + "controlflow";
      public static final String LABEL_GUARD = LABEL + "guard";
      public static final String LABEL_WEIGHT = LABEL + "weight";
      public static final String CONDITION = NODE + "condition";
      public static final String ICON_ACTION = ICON + "action";
      public static final String ACTION = NODE + "action";
      public static final String SENDSIGNAL = NODE + "sendsignal";
      public static final String ACCEPTEVENT = NODE + "acceptevent";
      public static final String TIMEEVENT = NODE + "timeevent";
      public static final String CALL = NODE + "call";
      public static final String CALL_REF = LABEL + "callref";
      public static final List<String> ACTIONS = List.of(ACTION, SENDSIGNAL, ACCEPTEVENT, TIMEEVENT, CALL);
      public static final String INITIALNODE = NODE + "initialnode";
      public static final String FINALNODE = NODE + "finalnode";
      public static final String FLOWFINALNODE = NODE + "flowfinalnode";
      public static final String DECISIONMERGENODE = NODE + "decisionnode";
      public static final String FORKJOINNODE = NODE + "forknode";
      public static final List<String> CONTROL_NODES = List.of(INITIALNODE, FINALNODE, FLOWFINALNODE, DECISIONMERGENODE,
            FORKJOINNODE);
      public static final String PARAMETER = NODE + "parameter";
      public static final String PIN = NODE + "pin";
      public static final String PIN_PORT = NODE + "pinport";
      public static final String CENTRALBUFFER = NODE + "centralbuffer";
      public static final String DATASTORE = NODE + "datastore";
      public static final String EXCEPTIONHANDLER = EDGE + "exceptionhandler";
      public static final String INTERRUPTIBLEREGION = NODE + "interruptibleregion";

      // USECASE DIAGRAM
      public static final String ICON_USECASE = ICON + "usecase";
      public static final String USECASE = NODE + "usecase";
      public static final String EXTENSIONPOINT = NODE + "extensionpoint";
      public static final String ICON_PACKAGE = ICON + "package";
      public static final String PACKAGE = NODE + "package";
      public static final String ICON_ACTOR = ICON + "actor";
      public static final String ACTOR = NODE + "actor";
      public static final String ICON_COMPONENT = ICON + "component";
      public static final String COMPONENT = NODE + "component";
      public static final String EXTEND = EDGE + "extend";
      public static final String INCLUDE = EDGE + "include";
      public static final String GENERALIZATION = EDGE + "generalization";
      public static final String CONNECTIONPOINT = LABEL + "connectionpoint";
      public static final String USECASE_ASSOCIATION = EDGE + "usecase-association";

      //DEPLOYMENT DIAGRAM
      public static final String ICON_DEPLOYMENT_NODE = ICON + "node";
      public static final String DEPLOYMENT_NODE = NODE + "node";
      public static final String ICON_ARTIFACT = ICON + "artifact";
      public static final String ARTIFACT = NODE + "artifact";
      public static final String COMMUNICATION_PATH = EDGE + "communicationpath";
      public static final String DEPLOYMENT = EDGE + "deployment";
      public static final String ICON_EXECUTION_ENVIRONMENT = ICON + "executionenvironment";
      public static final String EXECUTION_ENVIRONMENT = NODE + "executionenvironment";
      public static final String ICON_DEVICE = ICON + "device";
      public static final String DEVICE = NODE + "device";
      public static final String ICON_DEPLOYMENT_SPECIFICATION = ICON + "deploymentspecification";
      public static final String DEPLOYMENT_SPECIFICATION = NODE + "deploymentspecification";
      public static final String DEPLOYMENT_COMPONENT = NODE + "deploymentcomponent";

      //STATE MACHINE
      public static final String ICON_STATE_MACHINE = ICON + "state-machine";
      public static final String STATE_MACHINE = NODE + "state-machine";
      public static final String REGION = COMP_BASE + "region";
      public static final String ICON_STATE = ICON + "state";
      public static final String STATE = NODE + "state";
      public static final String FINAL_STATE = NODE + "final-state";
      public static final String STATE_ENTRY_ACTIVITY = NODE + "state-entry-activity";
      public static final String STATE_DO_ACTIVITY = NODE + "state-do-activity";
      public static final String STATE_EXIT_ACTIVITY = NODE + "state-exit-activity";
      // Pseudostates
      public static final String ICON_INITIAL_STATE = ICON + "initial-state";
      public static final String INITIAL_STATE = NODE + "initial-state";
      public static final String LABEL_VERTEX_NAME = LABEL + "vertex-name";
      public static final String DEEP_HISTORY = NODE + "deep-history";
      public static final String SHALLOW_HISTORY = NODE + "shallow-history";
      public static final String JOIN = NODE + "join";
      public static final String FORK = NODE + "fork";
      public static final String JUNCTION = NODE + "junction";
      public static final String CHOICE = NODE + "choice";
      public static final String ENTRY_POINT = NODE + "entry-point";
      public static final String EXIT_POINT = NODE + "exit-point";
      public static final String TERMINATE = NODE + "terminate";

      public static final String TRANSITION = EDGE + "transition";
      public static final String LABEL_TRANSITION_NAME = LABEL + "transition-name";
      public static final String LABEL_TRANSITION_GUARD = LABEL + "transition-guard";
      public static final String LABEL_TRANSITION_EFFECT = LABEL + "transition-effect";
      public static final String LABEL_TRANSITION_TRIGGER = LABEL + "transition-trigger";
      public static final List<String> PSEUDOSTATES = Arrays.asList(INITIAL_STATE, DEEP_HISTORY, SHALLOW_HISTORY, JOIN,
            FORK, JUNCTION, CHOICE, ENTRY_POINT, EXIT_POINT, TERMINATE);

      // COMMENT
      public static final String COMMENT = NODE + "comment";
      public static final String COMMENT_EDGE = EDGE + "commentlink";
      public static final List<String> LINKS_TO_COMMENT = Arrays.asList(COMMENT, ENTRY_POINT, EXIT_POINT, TERMINATE,
            CHOICE, JUNCTION, FORK, JOIN, SHALLOW_HISTORY, DEEP_HISTORY, INITIAL_STATE, STATE_DO_ACTIVITY,
            STATE_ENTRY_ACTIVITY, STATE_EXIT_ACTIVITY, FINAL_STATE, STATE, STATE_MACHINE, DEVICE, ARTIFACT,
            EXECUTION_ENVIRONMENT, DEPLOYMENT_NODE, ACTOR, COMPONENT, PACKAGE, EXTENSIONPOINT, USECASE,
            INTERRUPTIBLEREGION, DATASTORE, CENTRALBUFFER, PIN, PIN_PORT, PARAMETER, INITIALNODE, FINALNODE, FORKJOINNODE,
            FLOWFINALNODE, DECISIONMERGENODE, CALL, TIMEEVENT, ACCEPTEVENT, SENDSIGNAL, ACTION,
            CONDITION, ACTIVITY, PARTITION, CLASS, PROPERTY);

      private Types() {
      }
   }

   public static final class CSS {

      public static final String NODE = "uml-node";
      public static final String EDGE = "uml-edge";

      // OBJECT
      public static final String UNDERLINE = "uml-underline";

      //USECASE
      public static final String ELLIPSE = "uml-ellipse";
      public static final String EDGE_DOTTED = "uml-edge-dotted";
      public static final String EDGE_DASHED = "uml-edge-dashed";
      public static final String EDGE_DIRECTED_START = "uml-edge-directed-start";
      public static final String EDGE_DIRECTED_END = "uml-edge-directed-end";
      public static final String EDGE_DIRECTED_START_TENT = "uml-edge-directed-start-tent";
      public static final String EDGE_DIRECTED_END_TENT = "uml-edge-directed-end-tent";
      public static final String EDGE_DIRECTED_START_EMPTY = "uml-edge-directed-start-empty";
      public static final String EDGE_DIRECTED_END_EMPTY = "uml-edge-directed-end-empty";
      public static final String LABEL_TRANSPARENT = "label-transparent";

      // ACTIVITY
      public static final String ACTIVITY_CONDITION = "uml-activity-condition";

      // STATE MACHINE
      public static final String BORDER_ELEMENT = "uml-border-element";

      private CSS() {
      }
   }

   private UmlConfig() {
   }
}
