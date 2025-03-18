/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, type GEdgeSchema, Point } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';

import {
    type CommandExecutionContext,
    type CommandReturn,
    FeedbackCommand,
    FeedbackEdgeEndMovingMouseListener,
    findParentByFeature,
    GChildElement,
    GDanglingAnchor,
    getAbsolutePosition,
    type GModelElement,
    type GModelRoot,
    type GRoutableElement,
    isBoundsAware,
    isConnectable,
    isRoutable,
    MoveAction,
    toAbsolutePosition,
    TYPES
} from '@eclipse-glsp/client';
import { sequence_lifeline } from '../../elements/index.js';

import {
    defaultFeedbackEdgeSchema,
    FeedbackEdgeEnd,
    feedbackEdgeEndId,
    feedbackEdgeId
} from '@eclipse-glsp/client/lib/features/tools/edge-creation/dangling-edge-feedback.js';

// TODO: Sequence Diagram Specific

export interface SDDrawFeedbackPositionedEdgeAction extends Action {
    kind: typeof SDDrawFeedbackPositionedEdgeAction.KIND;
    elementTypeId: string;
    sourceId: string;
    sourcePosition: Point;
    edgeSchema?: GEdgeSchema;
}

export namespace SDDrawFeedbackPositionedEdgeAction {
    export const KIND = 'drawFeedbackPositionedEdge';

    export function is(object: any): object is SDDrawFeedbackPositionedEdgeAction {
        return Action.hasKind(object, KIND);
    }

    export function create(options: {
        elementTypeId: string;
        sourceId: string;
        sourcePosition: Point;
        edgeSchema?: GEdgeSchema;
    }): SDDrawFeedbackPositionedEdgeAction {
        return {
            kind: KIND,
            ...options
        };
    }
}

@injectable()
export class SDDrawFeedbackPositionedEdgeCommand extends FeedbackCommand {
    static readonly KIND = SDDrawFeedbackPositionedEdgeAction.KIND;

    constructor(@inject(TYPES.Action) protected action: SDDrawFeedbackPositionedEdgeAction) {
        super();
    }

    execute(context: CommandExecutionContext): CommandReturn {
        SDdrawFeedbackPositionedEdge(
            context,
            this.action.elementTypeId,
            this.action.sourceId,
            this.action.sourcePosition,
            this.action.edgeSchema
        );
        return context.root;
    }
}

export interface SDRemoveFeedbackPositionedEdgeAction extends Action {
    kind: typeof SDRemoveFeedbackPositionedEdgeAction.KIND;
}

export namespace SDRemoveFeedbackPositionedEdgeAction {
    export const KIND = 'removeFeedbackPositionedEdgeCommand';

    export function is(object: any): object is SDRemoveFeedbackPositionedEdgeAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): SDRemoveFeedbackPositionedEdgeAction {
        return { kind: KIND };
    }
}

@injectable()
export class SDRemoveFeedbackPositionedEdgeCommand extends FeedbackCommand {
    static readonly KIND = SDRemoveFeedbackPositionedEdgeAction.KIND;

    execute(context: CommandExecutionContext): CommandReturn {
        SDremoveFeedbackEdge(context.root);
        return context.root;
    }
}

export class SDFeedbackPositionedEdgeEnd extends GDanglingAnchor {
    static readonly TYPE = 'feedback-positioned-edge-end';
    constructor(
        readonly sourcePosition: Point,
        readonly elementTypeId: string,
        public feedbackEdge: GRoutableElement | undefined = undefined,
        override readonly type: string = SDFeedbackPositionedEdgeEnd.TYPE
    ) {
        super();
    }
}

export function SDdrawFeedbackPositionedEdge(
    context: CommandExecutionContext,
    elementTypeId: string,
    sourceId: string,
    sourcePosition: Point,
    edgeTemplate?: Partial<GEdgeSchema>
): void {
    const root = context.root;
    const sourceChild = root.index.getById(sourceId);
    if (!sourceChild) {
        return;
    }

    const source = findParentByFeature(sourceChild, isConnectable);
    if (!source || !isBoundsAware(source)) {
        return;
    }
    if (source.features?.has(sequence_lifeline)) {
        sourcePosition = { x: toAbsolutePosition(source).x + source.bounds.width / 2, y: sourcePosition.y };
    }

    const edgeStart = new SDFeedbackPositionedEdgeStart(sourcePosition, elementTypeId);
    edgeStart.bounds = {
        x: sourcePosition.x,
        y: sourcePosition.y,
        width: 0,
        height: 0
    };

    // TODO: correct feedback for Messages to self

    edgeStart.id = SDfeedbackEdgeStartId(root);

    const edgeEnd = new FeedbackEdgeEnd(source.id, elementTypeId);
    edgeEnd.id = feedbackEdgeEndId(root);
    edgeEnd.position = toAbsolutePosition(source);

    const edgeSchema: GEdgeSchema = {
        id: feedbackEdgeId(root),
        type: 'edge:sequence__Message', // TODO: check what this should be, remove hardcodeing
        sourceId: edgeStart.id,
        targetId: edgeEnd.id,
        ...defaultFeedbackEdgeSchema,
        ...edgeTemplate
    };
    const feedbackEdge = context.modelFactory.createElement(edgeSchema);
    if (isRoutable(feedbackEdge)) {
        edgeEnd.feedbackEdge = feedbackEdge;
        edgeStart.feedbackEdge = feedbackEdge;
        root.add(edgeStart);
        root.add(edgeEnd);
        root.add(feedbackEdge);
    }
}

export function SDremoveFeedbackEdge(root: GModelRoot): void {
    const feedbackEdge = root.index.getById(feedbackEdgeId(root));
    const feedbackEdgeStart = root.index.getById(SDfeedbackEdgeStartId(root));
    const feedbackEdgeEnd = root.index.getById(feedbackEdgeEndId(root));
    if (feedbackEdge instanceof GChildElement) {
        root.remove(feedbackEdge);
    }
    if (feedbackEdgeEnd instanceof GChildElement) {
        root.remove(feedbackEdgeEnd);
    }
    if (feedbackEdgeStart instanceof GChildElement) {
        root.remove(feedbackEdgeStart);
    }
}
export const SD_EDGESTART = 'feedback_anchor_start';

export function SDfeedbackEdgeStartId(root: GModelRoot): string {
    return root.id + '_' + SD_EDGESTART;
}

export class SDFeedbackPositionedEdgeStart extends GDanglingAnchor {
    static readonly TYPE = SD_EDGESTART;
    constructor(
        readonly sourcePoistion: Point,
        readonly elementTypeId: string,
        public feedbackEdge: GRoutableElement | undefined = undefined,
        override readonly type: string = FeedbackEdgeEnd.TYPE
    ) {
        super();
    }
}

export class SDFeedbackPositionedEdgeEndMovingMouseListener extends FeedbackEdgeEndMovingMouseListener {
    override mouseMove(target: GModelElement, event: MouseEvent): Action[] {
        const root = target.root;
        const edgeEnd = root.index.getById(feedbackEdgeEndId(root));
        if (!(edgeEnd instanceof FeedbackEdgeEnd) || !edgeEnd.feedbackEdge) {
            return [];
        }
        let position = getAbsolutePosition(edgeEnd, event);
        // const cursorOffset = { x: 3, y: 3 };
        const startPosition = edgeEnd.feedbackEdge.source?.position;

        if (startPosition) {
            // compute a shorter line to keep distance from cursor
            const cursorOffset = Point.normalize(Point.subtract(startPosition, position));
            position = Point.add(position, cursorOffset);

            if (!event.altKey) {
                position = { x: position.x, y: startPosition?.y };
            }
        }

        return [MoveAction.create([{ elementId: edgeEnd.id, toPosition: position }], { animate: false })];
    }
}
