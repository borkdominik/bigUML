/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
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

      // PREFIXES
      public static final String PRE_NODE = "node:";
      public static final String PRE_EDGE = "edge:";
      public static final String PRE_LABEL = "label:";
      public static final String PRE_COMP_BASE = "comp:";
      public static final String PRE_ICON = "icon:";

      public static final String LABEL_COMP = PRE_COMP_BASE + "label";
      public static final String COMPARTMENT = "comp";
      public static final String COMPARTMENT_HEADER = PRE_COMP_BASE + "header";
      public static final String PROPERTY = PRE_COMP_BASE + "property";
      public static final String ICON_PROPERTY = PRE_ICON + "property";
      public static final String LABEL_PROPERTY_NAME = PRE_LABEL + "property:name";
      public static final String LABEL_PROPERTY_TYPE = PRE_LABEL + "property:type";
      public static final String LABEL_PROPERTY_MULTIPLICITY = PRE_LABEL + "property:multiplicity";

      // COMMONS
      public static final String STRUCTURE = "struct";
      public static final String LABEL_NAME = PRE_LABEL + "name";
      public static final String LABEL_TEXT = PRE_LABEL + "text";
      public static final String LABEL_EDGE_NAME = PRE_LABEL + "edge-name";
      public static final String LABEL_EDGE_MULTIPLICITY = PRE_LABEL + "edge-multiplicity";
      public static final String COMP = PRE_COMP_BASE + "comp";
      // public static final String COMP_HEADER = COMP_BASE + "header";
      public static final String LABEL_ICON = PRE_LABEL + "icon";

      // CLASS DIAGRAM
      public static final String ICON_CLASS = PRE_ICON + "class";
      public static final String CLASS = PRE_NODE + "class";
      public static final String ABSTRACT_CLASS = PRE_NODE + "abstract-class";
      public static final String ENUMERATION = PRE_NODE + "enumeration";
      public static final String ICON_ENUMERATION = PRE_ICON + "enumeration";
      public static final String INTERFACE = PRE_NODE + "interface";
      // public static final String PROPERTY = NODE + "property";
      public static final String ASSOCIATION = PRE_EDGE + "association";
      public static final String COMPOSITION = PRE_EDGE + "composition";
      public static final String AGGREGATION = PRE_EDGE + "aggregation";
      public static final String CLASS_GENERALIZATION = PRE_EDGE + "class-generalization";

      // OBJECT DIAGRAM
      public static final String ICON_OBJECT = PRE_ICON + "object";
      public static final String OBJECT = PRE_NODE + "object";
      public static final String ATTRIBUTE = PRE_NODE + "attribute";
      public static final String LINK = PRE_EDGE + "link";

      // ACTIVITY DIAGRAM
      public static final String ICON_ACTIVITY = PRE_ICON + "activity";
      public static final String ACTIVITY = PRE_NODE + "activity";
      public static final String PARTITION = PRE_NODE + "partition";
      public static final String CONTROLFLOW = PRE_EDGE + "controlflow";
      public static final String LABEL_GUARD = PRE_LABEL + "guard";
      public static final String LABEL_WEIGHT = PRE_LABEL + "weight";
      public static final String CONDITION = PRE_NODE + "condition";
      public static final String ICON_ACTION = PRE_ICON + "action";
      public static final String ACTION = PRE_NODE + "action";
      public static final String SENDSIGNAL = PRE_NODE + "sendsignal";
      public static final String ACCEPTEVENT = PRE_NODE + "acceptevent";
      public static final String TIMEEVENT = PRE_NODE + "timeevent";
      public static final String CALL = PRE_NODE + "call";
      public static final String CALL_REF = PRE_LABEL + "callref";
      public static final List<String> ACTIONS = List.of(ACTION, SENDSIGNAL, ACCEPTEVENT, TIMEEVENT, CALL);
      public static final String INITIALNODE = PRE_NODE + "initialnode";
      public static final String FINALNODE = PRE_NODE + "finalnode";
      public static final String FLOWFINALNODE = PRE_NODE + "flowfinalnode";
      public static final String DECISIONMERGENODE = PRE_NODE + "decisionnode";
      public static final String FORKJOINNODE = PRE_NODE + "forknode";
      public static final List<String> CONTROL_NODES = List.of(INITIALNODE, FINALNODE, FLOWFINALNODE, DECISIONMERGENODE,
         FORKJOINNODE);
      public static final String PARAMETER = PRE_NODE + "parameter";
      public static final String PIN = PRE_NODE + "pin";
      public static final String PIN_PORT = PRE_NODE + "pinport";
      public static final String CENTRALBUFFER = PRE_NODE + "centralbuffer";
      public static final String DATASTORE = PRE_NODE + "datastore";
      public static final String EXCEPTIONHANDLER = PRE_EDGE + "exceptionhandler";
      public static final String INTERRUPTIBLEREGION = PRE_NODE + "interruptibleregion";

      // USECASE DIAGRAM
      public static final String ICON_USECASE = PRE_ICON + "usecase";
      public static final String USECASE = PRE_NODE + "usecase";
      public static final String EXTENSIONPOINT = PRE_NODE + "extensionpoint";
      public static final String ICON_PACKAGE = PRE_ICON + "package";
      public static final String PACKAGE = PRE_NODE + "package";
      public static final String LABEL_PACKAGE_NAME = PRE_LABEL + "package:name";
      public static final String ICON_ACTOR = PRE_ICON + "actor";
      public static final String ACTOR = PRE_NODE + "actor";
      public static final String ICON_COMPONENT = PRE_ICON + "component";
      public static final String COMPONENT = PRE_NODE + "component";
      public static final String EXTEND = PRE_EDGE + "extend";
      public static final String INCLUDE = PRE_EDGE + "include";
      public static final String GENERALIZATION = PRE_EDGE + "generalization";
      public static final String CONNECTIONPOINT = PRE_LABEL + "connectionpoint";
      public static final String USECASE_ASSOCIATION = PRE_EDGE + "usecase-association";

      // DEPLOYMENT DIAGRAM
      public static final String ICON_DEPLOYMENT_NODE = PRE_ICON + "node";
      public static final String DEPLOYMENT_NODE = PRE_NODE + "node";
      public static final String LABEL_NODE_NAME = PRE_LABEL + "node:name";
      public static final String ICON_ARTIFACT = PRE_ICON + "artifact";
      public static final String ARTIFACT = PRE_NODE + "artifact";
      public static final String COMMUNICATION_PATH = PRE_EDGE + "communicationpath";
      public static final String DEPLOYMENT = PRE_EDGE + "deployment";
      public static final String ICON_EXECUTION_ENVIRONMENT = PRE_ICON + "executionenvironment";
      public static final String EXECUTION_ENVIRONMENT = PRE_NODE + "executionenvironment";
      public static final String ICON_DEVICE = PRE_ICON + "device";
      public static final String DEVICE = PRE_NODE + "device";
      public static final String ICON_DEPLOYMENT_SPECIFICATION = PRE_ICON + "deploymentspecification";
      public static final String DEPLOYMENT_SPECIFICATION = PRE_NODE + "deploymentspecification";
      public static final String DEPLOYMENT_COMPONENT = PRE_NODE + "deploymentcomponent";

      // STATE MACHINE
      public static final String ICON_STATE_MACHINE = PRE_ICON + "state-machine";
      public static final String STATE_MACHINE = PRE_NODE + "state-machine";
      // public static final String REGION = COMP_BASE + "region";
      public static final String REGION = PRE_NODE + "region";
      public static final String ICON_STATE = PRE_ICON + "state";
      public static final String STATE = PRE_NODE + "state";
      public static final String FINAL_STATE = PRE_NODE + "final-state";
      public static final String STATE_ENTRY_ACTIVITY = PRE_NODE + "state-entry-activity";
      public static final String STATE_DO_ACTIVITY = PRE_NODE + "state-do-activity";
      public static final String STATE_EXIT_ACTIVITY = PRE_NODE + "state-exit-activity";
      // Pseudostates
      public static final String ICON_INITIAL_STATE = PRE_ICON + "initial-state";
      public static final String INITIAL_STATE = PRE_NODE + "initial-state";
      public static final String LABEL_VERTEX_NAME = PRE_LABEL + "vertex-name";
      public static final String DEEP_HISTORY = PRE_NODE + "deep-history";
      public static final String SHALLOW_HISTORY = PRE_NODE + "shallow-history";
      public static final String JOIN = PRE_NODE + "join";
      public static final String FORK = PRE_NODE + "fork";
      public static final String JUNCTION = PRE_NODE + "junction";
      public static final String CHOICE = PRE_NODE + "choice";
      public static final String ENTRY_POINT = PRE_NODE + "entry-point";
      public static final String EXIT_POINT = PRE_NODE + "exit-point";
      public static final String TERMINATE = PRE_NODE + "terminate";

      public static final String TRANSITION = PRE_EDGE + "transition";
      public static final String LABEL_TRANSITION_NAME = PRE_LABEL + "transition-name";
      public static final String LABEL_TRANSITION_GUARD = PRE_LABEL + "transition-guard";
      public static final String LABEL_TRANSITION_EFFECT = PRE_LABEL + "transition-effect";
      public static final String LABEL_TRANSITION_TRIGGER = PRE_LABEL + "transition-trigger";
      public static final List<String> PSEUDOSTATES = Arrays.asList(INITIAL_STATE, DEEP_HISTORY, SHALLOW_HISTORY, JOIN,
         FORK, JUNCTION, CHOICE, ENTRY_POINT, EXIT_POINT, TERMINATE);

      // COMMENT
      public static final String COMMENT = PRE_NODE + "comment";
      public static final String COMMENT_EDGE = PRE_EDGE + "commentlink";
      public static final List<String> LINKS_TO_COMMENT = Arrays.asList(COMMENT, ENTRY_POINT, EXIT_POINT, TERMINATE,
         CHOICE, JUNCTION, FORK, JOIN, SHALLOW_HISTORY, DEEP_HISTORY, INITIAL_STATE, STATE_DO_ACTIVITY,
         STATE_ENTRY_ACTIVITY, STATE_EXIT_ACTIVITY, FINAL_STATE, STATE, STATE_MACHINE, DEVICE, ARTIFACT,
         EXECUTION_ENVIRONMENT, DEPLOYMENT_NODE, ACTOR, COMPONENT, PACKAGE, EXTENSIONPOINT, USECASE,
         INTERRUPTIBLEREGION, DATASTORE, CENTRALBUFFER, PIN, PIN_PORT, PARAMETER, INITIALNODE, FINALNODE,
         FORKJOINNODE,
         FLOWFINALNODE, DECISIONMERGENODE, CALL, TIMEEVENT, ACCEPTEVENT, SENDSIGNAL, ACTION,
         CONDITION, ACTIVITY, PARTITION, CLASS, PROPERTY);

      private Types() {}
   }

   public static final class CSS {

      public static final String NODE = "uml-node";
      public static final String EDGE = "uml-edge";

      // CLASS
      public static final String EDGE_DIAMOND = "uml-edge-directed-diamond";
      public static final String EDGE_DIAMOND_EMPTY = "uml-edge-directed-diamond-empty";

      // OBJECT
      public static final String UNDERLINE = "uml-underline";

      // USECASE
      public static final String ELLIPSE = "uml-ellipse";
      public static final String PACKAGEABLE_NODE = "uml-packageable-node";
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

      // DEPLOYMENT
      public static final String DEPLOYMENT_NODE = "uml-node";

      private CSS() {}
   }

   private UmlConfig() {}
}
