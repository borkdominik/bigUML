/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    configureCommand,
    configureView,
    DrawFeedbackEdgeCommand,
    FeedbackEdgeEnd,
    HideChangeBoundsToolResizeFeedbackCommand,
    HideEdgeReconnectHandlesFeedbackCommand,
    LocationPostprocessor,
    ModifyCssFeedbackCommand,
    MoveCommand,
    RemoveFeedbackEdgeCommand,
    ShowChangeBoundsToolResizeFeedbackCommand,
    ShowEdgeReconnectHandlesFeedbackCommand,
    SResizeHandle,
    SwitchRoutingModeCommand,
    TYPES
} from '@eclipse-glsp/client';
import { DrawMarqueeCommand, RemoveMarqueeCommand } from '@eclipse-glsp/client/lib/features/tool-feedback/marquee-tool-feedback';
import { FeedbackEdgeEndView, SResizeHandleView } from '@eclipse-glsp/client/lib/features/tool-feedback/view';
import { ContainerModule } from 'inversify';
import {
    SDDrawFeedbackPositionedEdgeCommand,
    SDRemoveFeedbackPositionedEdgeCommand
} from '../../uml/diagram/sequence/features/tool-feedback/creation-tool-feedback.extension';
import {
    SDDrawHorizontalShiftCommand,
    SDRemoveHorizontalShiftCommand
} from '../../uml/diagram/sequence/features/tool-feedback/horizontal-shift-tool-feedback';
import {
    SDDrawVerticalShiftCommand,
    SDRemoveVerticalShiftCommand
} from '../../uml/diagram/sequence/features/tool-feedback/vertical-shift-tool-feedback';
import { UmlDrawFeedbackEdgeSourceCommand } from './edge/edge-feedback.command';
import { UmlFeedbackActionDispatcher } from './feedback-action-dispatcher';

export const umlToolFeedbackModule = new ContainerModule((bind, _unbind, isBound) => {
    const context = { bind, isBound };
    bind(TYPES.IFeedbackActionDispatcher).to(UmlFeedbackActionDispatcher).inSingletonScope();

    configureCommand(context, ModifyCssFeedbackCommand);

    // create node and edge tool feedback
    configureCommand(context, DrawFeedbackEdgeCommand);
    configureCommand(context, RemoveFeedbackEdgeCommand);

    configureCommand(context, DrawMarqueeCommand);
    configureCommand(context, RemoveMarqueeCommand);

    configureView(context, FeedbackEdgeEnd.TYPE, FeedbackEdgeEndView);
    // move tool feedback: we use sprotty's MoveCommand as client-side visual feedback
    configureCommand(context, MoveCommand);

    // resize tool feedback
    configureCommand(context, ShowChangeBoundsToolResizeFeedbackCommand);
    configureCommand(context, HideChangeBoundsToolResizeFeedbackCommand);
    configureView(context, SResizeHandle.TYPE, SResizeHandleView);

    // reconnect edge tool feedback
    configureCommand(context, ShowEdgeReconnectHandlesFeedbackCommand);
    configureCommand(context, HideEdgeReconnectHandlesFeedbackCommand);
    configureCommand(context, UmlDrawFeedbackEdgeSourceCommand);

    configureCommand(context, SwitchRoutingModeCommand);

    bind(LocationPostprocessor).toSelf().inSingletonScope();
    bind(TYPES.IVNodePostprocessor).toService(LocationPostprocessor);
    bind(TYPES.HiddenVNodePostprocessor).toService(LocationPostprocessor);

    configureCommand({ bind, isBound }, SDDrawFeedbackPositionedEdgeCommand);
    configureCommand({ bind, isBound }, SDRemoveFeedbackPositionedEdgeCommand);

    configureCommand({ bind, isBound }, SDDrawVerticalShiftCommand);
    configureCommand({ bind, isBound }, SDRemoveVerticalShiftCommand);
    configureCommand({ bind, isBound }, SDDrawHorizontalShiftCommand);
    configureCommand({ bind, isBound }, SDRemoveHorizontalShiftCommand);
});
