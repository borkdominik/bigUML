/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    bindAsService,
    configureCommand,
    FeatureModule,
    HideEdgeReconnectHandlesFeedbackCommand,
    ShowEdgeReconnectHandlesFeedbackCommand,
    SwitchRoutingModeCommand,
    TYPES
} from '@eclipse-glsp/client';
import { configureDanglingFeedbackEdge } from '@eclipse-glsp/client/lib/features/tools/edge-creation/dangling-edge-feedback';
import { UmlDrawFeedbackEdgeSourceCommand } from './edge-edit-tool-feedback';
import { UmlEdgeEditTool } from './edge-edit.tool';

export const umlEdgeEditToolModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindAsService(context, TYPES.IDefaultTool, UmlEdgeEditTool);

    // reconnect edge tool feedback
    configureCommand(context, ShowEdgeReconnectHandlesFeedbackCommand);
    configureCommand(context, HideEdgeReconnectHandlesFeedbackCommand);
    configureCommand(context, UmlDrawFeedbackEdgeSourceCommand);
    configureCommand(context, SwitchRoutingModeCommand);

    // dangling edge feedback
    configureDanglingFeedbackEdge(context);});
