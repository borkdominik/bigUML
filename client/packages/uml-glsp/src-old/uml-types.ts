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
import { DefaultTypes } from '@eclipse-glsp/protocol';

export namespace UmlTypes {
    // OBJECT DIAGRAM
    export const OBJECT = `${DefaultTypes.NODE}:object`;
    export const LINK = `${DefaultTypes.EDGE}:link`;
    export const ATTRIBUTE = `${DefaultTypes.NODE}:attribute`;

    // ACTIVITY DIAGRAM
    export const ACTIVITY = `${DefaultTypes.NODE}:activity`;
    export const ICON_ACTIVITY = `${ICON}:activity`;
    export const PARTITION = `${DefaultTypes.NODE}:partition`;
    export const ACTION = `${DefaultTypes.NODE}:action`;
    export const ICON_ACTION = `${ICON}:action`;
    export const SENDSIGNAL = `${DefaultTypes.NODE}:sendsignal`;
    export const ACCEPTEVENT = `${DefaultTypes.NODE}:acceptevent`;
    export const TIMEEVENT = `${DefaultTypes.NODE}:timeevent`;
    export const CALL = `${DefaultTypes.NODE}:call`;
    export const CALL_REF = `${DefaultTypes.LABEL}:callref`;
    export const CONTROLFLOW = `${DefaultTypes.EDGE}:controlflow`;
    export const LABEL_FLOW_GUARD = `${DefaultTypes.LABEL}:guard`;
    export const LABEL_FLOW_WEIGHT = `${DefaultTypes.LABEL}:weight`;
    // ControlNodes
    export const INITIALNODE = `${DefaultTypes.NODE}:initialnode`;
    export const FINALNODE = `${DefaultTypes.NODE}:finalnode`;
    export const FLOWFINALNODE = `${DefaultTypes.NODE}:flowfinalnode`;
    export const DECISIONMERGENODE = `${DefaultTypes.NODE}:decisionnode`;
    export const FORKJOINNODE = `${DefaultTypes.NODE}:forknode`;
    export const PARAMETER = `${DefaultTypes.NODE}:parameter`;
    export const PIN = `${DefaultTypes.NODE}:pin`;
    export const PIN_PORT = `${DefaultTypes.NODE}:pinport`;
    export const CENTRALBUFFER = `${DefaultTypes.NODE}:centralbuffer`;
    export const DATASTORE = `${DefaultTypes.NODE}:datastore`;
    export const EXCEPTIONHANDLER = `${DefaultTypes.EDGE}:exceptionhandler`;
    export const INTERRUPTIBLEREGION = `${DefaultTypes.NODE}:interruptibleregion`;
    export const CONDITION = `${DefaultTypes.NODE}:condition`;
    export const COMMENT = `${DefaultTypes.NODE}:comment`;
    export const COMMENT_LINK = `${DefaultTypes.EDGE}:commentlink`;

    // USECASE DIAGRAM
    export const USECASE = `${DefaultTypes.NODE}:usecase`;
    export const ICON_USECASE = `${ICON}:usecase`;
    export const ACTOR = `${DefaultTypes.NODE}:actor`;
    export const ICON_ACTOR = `${ICON}:actor`;
    // export const PACKAGE = `${DefaultTypes.NODE}:package`;
    export const LABEL_PACKAGE_NAME = `${DefaultTypes.LABEL}:package:name`;
    // export const ICON_PACKAGE = `${ICON}:package`;
    export const COMPONENT = `${DefaultTypes.NODE}:component`;
    export const EXTENSIONPOINT = `${DefaultTypes.NODE}:extensionpoint`;
    export const EXTEND = `${DefaultTypes.EDGE}:extend`;
    export const INCLUDE = `${DefaultTypes.EDGE}:include`;
    export const GENERALIZATION = `${DefaultTypes.EDGE}:generalization`;
    export const CONNECTIONPOINT = `${DefaultTypes.EDGE}:connectionpoint`;
    export const USECASE_ASSOCIATION = `${DefaultTypes.EDGE}:usecase-association`;

    // DEPLOYMENT DIAGRAM
    export const ICON_DEPLOYMENT_NODE = `${ICON}:node`;
    export const DEPLOYMENT_NODE = `${DefaultTypes.NODE}:node`;
    export const ICON_ARTIFACT = `${ICON}:artifact`;
    export const ARTIFACT = `${DefaultTypes.NODE}:artifact`;
    export const COMMUNICATION_PATH = `${DefaultTypes.EDGE}:communicationpath`;
    export const DEPLOYMENT = `${DefaultTypes.EDGE}:deployment`;
    export const ICON_EXECUTION_ENVIRONMENT = `${ICON}:executionenvironment`;
    export const EXECUTION_ENVIRONMENT = `${DefaultTypes.NODE}:executionenvironment`;
    export const ICON_DEVICE = `${ICON}:device`;
    export const DEVICE = `${DefaultTypes.NODE}:device`;
    export const ICON_DEPLOYMENT_SPECIFICATION = `${ICON}:deploymentspecification`;
    export const DEPLOYMENT_SPECIFICATION = `${DefaultTypes.NODE}:deploymentspecification`;
    export const DEPLOYMENT_COMPONENT = `${DefaultTypes.NODE}:deploymentcomponent`;

    // STATE MACHINE DIAGRAM
    export const ICON_STATE_MACHINE = `${ICON}:state-machine`;
    export const STATE_MACHINE = `${DefaultTypes.NODE}:state-machine`;
    export const REGION = `${DefaultTypes.NODE}:region`;
    export const ICON_STATE = `${ICON}:state`;
    export const STATE = `${DefaultTypes.NODE}:state`;
    export const LABEL_VERTEX_NAME = `${DefaultTypes.LABEL}:vertex-name`;
    export const INITIAL_STATE = `${DefaultTypes.NODE}:initial-state`;
    export const DEEP_HISTORY = `${DefaultTypes.NODE}:deep-history`;
    export const SHALLOW_HISTORY = `${DefaultTypes.NODE}:shallow-history`;
    export const FORK = `${DefaultTypes.NODE}:fork`;
    export const JOIN = `${DefaultTypes.NODE}:join`;
    export const JUNCTION = `${DefaultTypes.NODE}:junction`;
    export const CHOICE = `${DefaultTypes.NODE}:choice`;
    export const ENTRY_POINT = `${DefaultTypes.NODE}:entry-point`;
    export const EXIT_POINT = `${DefaultTypes.NODE}:exit-point`;
    export const TERMINATE = `${DefaultTypes.NODE}:terminate`;
    export const FINAL_STATE = `${DefaultTypes.NODE}:final-state`;
    export const STATE_ENTRY_ACTIVITY = `${DefaultTypes.NODE}:state-entry-activity`;
    export const STATE_DO_ACTIVITY = `${DefaultTypes.NODE}:state-do-activity`;
    export const STATE_EXIT_ACTIVITY = `${DefaultTypes.NODE}:state-exit-activity`;
    export const TRANSITION = `${DefaultTypes.EDGE}:transition`;
    export const LABEL_TRANSITION_NAME = `${DefaultTypes.LABEL}:transition-name`;
    export const LABEL_TRANSITION_GUARD = `${DefaultTypes.LABEL}:transition-guard`;
    export const LABEL_TRANSITION_EFFECT = `${DefaultTypes.LABEL}:transition-effect`;
    export const LABEL_TRANSITION_TRIGGER = `${DefaultTypes.LABEL}:transition-trigger`;
}
