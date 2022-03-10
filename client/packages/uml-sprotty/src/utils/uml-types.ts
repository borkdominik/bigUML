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
import { BaseTypes } from "./base-types";

export namespace UmlTypes {

    // COMMONS
    export const LABEL_NAME = `${BaseTypes.LABEL}:name`;
    export const LABEL_TEXT = `${BaseTypes.LABEL}:text`;
    export const LABEL_EDGE_NAME = `${BaseTypes.LABEL}:edge-name`;
    export const LABEL_EDGE_MULTIPLICITY = `${BaseTypes.LABEL}:edge-multiplicity`;
    export const LABEL_ICON = `${BaseTypes.LABEL}:${BaseTypes.ICON}`;

    // CLASS DIAGRAM
    export const ICON_CLASS = `${BaseTypes.ICON}:class`;
    export const CLASS = `${BaseTypes.NODE}:class`;
    export const ASSOCIATION = `${BaseTypes.EDGE}:association`;
    export const PROPERTY = `${BaseTypes.NODE}:property`;

    // OBJECT DIAGRAM
    export const ICON_OBJECT = `${BaseTypes.ICON}:object`;
    export const OBJECT = `${BaseTypes.NODE}:object`;
    export const LINK = `${BaseTypes.EDGE}:link`;
    export const ATTRIBUTE = `${BaseTypes.NODE}:attribute`;

    // ACTIVITY DIAGRAM
    export const ACTIVITY = `${BaseTypes.NODE}:activity`;
    export const ICON_ACTIVITY = `${BaseTypes.ICON}:activity`;
    export const PARTITION = `${BaseTypes.NODE}:partition`;
    export const ACTION = `${BaseTypes.NODE}:action`;
    export const ICON_ACTION = `${BaseTypes.ICON}:action`;
    export const SENDSIGNAL = `${BaseTypes.NODE}:sendsignal`;
    export const ACCEPTEVENT = `${BaseTypes.NODE}:acceptevent`;
    export const TIMEEVENT = `${BaseTypes.NODE}:timeevent`;
    export const CALL = `${BaseTypes.NODE}:call`;
    export const CALL_REF = `${BaseTypes.LABEL}:callref`;
    export const CONTROLFLOW = `${BaseTypes.EDGE}:controlflow`;
    export const LABEL_FLOW_GUARD = `${BaseTypes.LABEL}:guard`;
    export const LABEL_FLOW_WEIGHT = `${BaseTypes.LABEL}:weight`;
    // ControlNodes
    export const INITIALNODE = `${BaseTypes.NODE}:initialnode`;
    export const FINALNODE = `${BaseTypes.NODE}:finalnode`;
    export const FLOWFINALNODE = `${BaseTypes.NODE}:flowfinalnode`;
    export const DECISIONMERGENODE = `${BaseTypes.NODE}:decisionnode`;
    export const FORKJOINNODE = `${BaseTypes.NODE}:forknode`;
    export const PARAMETER = `${BaseTypes.NODE}:parameter`;
    export const PIN = `${BaseTypes.NODE}:pin`;
    export const PIN_PORT = `${BaseTypes.NODE}:pinport`;
    export const CENTRALBUFFER = `${BaseTypes.NODE}:centralbuffer`;
    export const DATASTORE = `${BaseTypes.NODE}:datastore`;
    export const EXCEPTIONHANDLER =`${BaseTypes.EDGE}:exceptionhandler`;
    export const INTERRUPTIBLEREGION = `${BaseTypes.NODE}:interruptibleregion`;
    export const CONDITION = `${BaseTypes.NODE}:condition`;
    export const COMMENT = `${BaseTypes.NODE}:comment`;
    export const COMMENT_LINK = `${BaseTypes.EDGE}:commentlink`;

    // USECASE DIAGRAM
    export const USECASE = `${BaseTypes.NODE}:usecase`;
    export const ICON_USECASE = `${BaseTypes.ICON}:usecase`;
    export const ACTOR = `${BaseTypes.NODE}:actor`;
    export const ICON_ACTOR = `${BaseTypes.ICON}:actor`;
    export const PACKAGE = `${BaseTypes.NODE}:package`;
    export const ICON_PACKAGE = `${BaseTypes.ICON}:package`;
    export const COMPONENT = `${BaseTypes.NODE}:component`;
    export const EXTENSIONPOINT = `${BaseTypes.NODE}:extensionpoint`;
    export const EXTEND = `${BaseTypes.EDGE}:extend`;
    export const INCLUDE = `${BaseTypes.EDGE}:include`;
    export const GENERALIZATION = `${BaseTypes.EDGE}:generalization`;
    export const CONNECTIONPOINT = `${BaseTypes.EDGE}:connectionpoint`;
    export const USECASE_ASSOCIATION = `${BaseTypes.EDGE}:usecase-association`;

    // DEPLOYMENT DIAGRAM
    export const ICON_DEPLOYMENT_NODE = `${BaseTypes.ICON}:node`;
    export const DEPLOYMENT_NODE = `${BaseTypes.NODE}:node`;
    export const ICON_ARTIFACT = `${BaseTypes.ICON}:artifact`;
    export const ARTIFACT = `${BaseTypes.NODE}:artifact`;
    export const COMMUNICATION_PATH = `${BaseTypes.EDGE}:communicationpath`;
    export const DEPLOYMENT = `${BaseTypes.EDGE}:deployment`;
    export const ICON_EXECUTION_ENVIRONMENT = `${BaseTypes.ICON}:executionenvironment`;
    export const EXECUTION_ENVIRONMENT = `${BaseTypes.NODE}:executionenvironment`;
    export const ICON_DEVICE = `${BaseTypes.ICON}:device`;
    export const DEVICE = `${BaseTypes.NODE}:device`;
    export const ICON_DEPLOYMENT_SPECIFICATION = `${BaseTypes.ICON}:deploymentspecification`;
    export const DEPLOYMENT_SPECIFICATION = `${BaseTypes.NODE}:deploymentspecification`;

    // STATE MACHINE DIAGRAM
    export const ICON_STATE_MACHINE = `${BaseTypes.ICON}:state-machine`;
    export const STATE_MACHINE = `${BaseTypes.NODE}:state-machine`;
    export const ICON_STATE = `${BaseTypes.ICON}:state`;
    export const STATE = `${BaseTypes.NODE}:state`;
    export const LABEL_VERTEX_NAME = `${BaseTypes.LABEL}:vertex-name`;
    export const INITIAL_STATE = `${BaseTypes.NODE}:initial-state`;
    export const DEEP_HISTORY = `${BaseTypes.NODE}:deep-history`;
    export const SHALLOW_HISTORY = `${BaseTypes.NODE}:shallow-history`;
    export const FORK = `${BaseTypes.NODE}:fork`;
    export const JOIN = `${BaseTypes.NODE}:join`;
    export const JUNCTION = `${BaseTypes.NODE}:junction`;
    export const CHOICE = `${BaseTypes.NODE}:choice`;
    export const ENTRY_POINT = `${BaseTypes.NODE}:entry-point`;
    export const EXIT_POINT = `${BaseTypes.NODE}:exit-point`;
    export const TERMINATE = `${BaseTypes.NODE}:terminate`;
    export const FINAL_STATE = `${BaseTypes.NODE}:final-state`;
    export const STATE_ENTRY_ACTIVITY = `${BaseTypes.NODE}:state-entry-activity`;
    export const STATE_DO_ACTIVITY = `${BaseTypes.NODE}:state-do-activity`;
    export const STATE_EXIT_ACTIVITY = `${BaseTypes.NODE}:state-exit-activity`;
    export const TRANSITION = `${BaseTypes.EDGE}:transition`;
    export const LABEL_TRANSITION_NAME = `${BaseTypes.LABEL}:transition-name`;
    export const LABEL_TRANSITION_GUARD = `${BaseTypes.LABEL}:transition-guard`;
    export const LABEL_TRANSITION_EFFECT = `${BaseTypes.LABEL}:transition-effect`;
    export const LABEL_TRANSITION_TRIGGER = `${BaseTypes.LABEL}:transition-trigger`;
}
