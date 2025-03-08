/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/*
import {
    type CommandExecutionContext,
    type CommandReturn,
    type DrawFeedbackEdgeSourceAction,
    DrawFeedbackEdgeSourceCommand,
    findParentByFeature,
    isBoundsAware,
    isConnectable,
    isRoutable,
    TYPES
} from '@eclipse-glsp/client';
import {
    FeedbackEdgeEnd,
    feedbackEdgeEndId,
    feedbackEdgeId
} from '@eclipse-glsp/client/lib/features/tools/edge-creation/dangling-edge-feedback.js';
import { inject, injectable } from 'inversify';

@injectable()
export class UMLDrawFeedbackEdgeSourceCommand extends DrawFeedbackEdgeSourceCommand {
    constructor(@inject(TYPES.Action) action: DrawFeedbackEdgeSourceAction) {
        super(action);
    }

    override execute(context: CommandExecutionContext): CommandReturn {
        drawFeedbackEdgeSource(context, this.action.targetId, this.action.elementTypeId);
        return context.root;
    }
}

function drawFeedbackEdgeSource(context: CommandExecutionContext, targetId: string, elementTypeId: string): void {
    const root = context.root;
    const targetChild = root.index.getById(targetId);
    if (!targetChild) {
        return;
    }

    const target = findParentByFeature(targetChild, isConnectable);
    if (!target || !isBoundsAware(target)) {
        return;
    }

    const edgeEnd = new FeedbackEdgeEnd(target.id, elementTypeId);
    edgeEnd.id = feedbackEdgeEndId(root);
    edgeEnd.position = { x: target.bounds.x, y: target.bounds.y };

    const feedbackEdgeSchema = {
        type: elementTypeId,
        id: feedbackEdgeId(root),
        sourceId: edgeEnd.id,
        targetId: target.id,
        opacity: 0.3
    };

    const feedbackEdge = context.modelFactory.createElement(feedbackEdgeSchema);
    if (isRoutable(feedbackEdge)) {
        edgeEnd.feedbackEdge = feedbackEdge;
        root.add(edgeEnd);
        root.add(feedbackEdge);
    }
}
*/
