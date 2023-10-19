/********************************************************************************
 * Copyright (c) 2019-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { Action, Point, SEdgeSchema } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';

import {
    CommandExecutionContext,
    CommandReturn,
    FeedbackCommand,
    FeedbackEdgeEnd,
    FeedbackEdgeEndMovingMouseListener,
    MoveAction,
    SChildElement,
    SDanglingAnchor,
    SModelElement,
    SModelRoot,
    SRoutableElement,
    TYPES,
    defaultFeedbackEdgeSchema,
    feedbackEdgeEndId,
    feedbackEdgeId,
    findParentByFeature,
    getAbsolutePosition,
    isBoundsAware,
    isConnectable,
    isRoutable,
    toAbsolutePosition
} from '@eclipse-glsp/client';
import { sequence_lifeline } from '../../uml/diagram/sequence/elements';

export interface DrawFeedbackPositionedEdgeAction extends Action {
    kind: typeof DrawFeedbackPositionedEdgeAction.KIND;
    elementTypeId: string;
    sourceId: string;
    sourcePosition: Point;
    edgeSchema?: SEdgeSchema;
}

export namespace DrawFeedbackPositionedEdgeAction {
    export const KIND = 'drawFeedbackPositionedEdge';

    export function is(object: any): object is DrawFeedbackPositionedEdgeAction {
        return Action.hasKind(object, KIND);
    }

    export function create(options: {
        elementTypeId: string;
        sourceId: string;
        sourcePosition: Point;
        edgeSchema?: SEdgeSchema;
    }): DrawFeedbackPositionedEdgeAction {
        return {
            kind: KIND,
            ...options
        };
    }
}

@injectable()
export class DrawFeedbackPositionedEdgeCommand extends FeedbackCommand {
    static readonly KIND = DrawFeedbackPositionedEdgeAction.KIND;

    constructor(@inject(TYPES.Action) protected action: DrawFeedbackPositionedEdgeAction) {
        super();
    }

    execute(context: CommandExecutionContext): CommandReturn {
        drawFeedbackPositionedEdge(
            context,
            this.action.elementTypeId,
            this.action.sourceId,
            this.action.sourcePosition,
            this.action.edgeSchema
        );
        return context.root;
    }
}

export interface RemoveFeedbackPositionedEdgeAction extends Action {
    kind: typeof RemoveFeedbackPositionedEdgeAction.KIND;
}

export namespace RemoveFeedbackPositionedEdgeAction {
    export const KIND = 'removeFeedbackPositionedEdgeCommand';

    export function is(object: any): object is RemoveFeedbackPositionedEdgeAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): RemoveFeedbackPositionedEdgeAction {
        return { kind: KIND };
    }
}

@injectable()
export class RemoveFeedbackPositionedEdgeCommand extends FeedbackCommand {
    static readonly KIND = RemoveFeedbackPositionedEdgeAction.KIND;

    execute(context: CommandExecutionContext): CommandReturn {
        removeFeedbackEdge(context.root);
        return context.root;
    }
}

export class FeedbackPositionedEdgeEnd extends SDanglingAnchor {
    static readonly TYPE = 'feedback-positioned-edge-end';
    constructor(
        readonly sourcePosition: Point,
        readonly elementTypeId: string,
        public feedbackEdge: SRoutableElement | undefined = undefined,
        override readonly type: string = FeedbackPositionedEdgeEnd.TYPE
    ) {
        super();
    }
}

export function drawFeedbackPositionedEdge(
    context: CommandExecutionContext,
    elementTypeId: string,
    sourceId: string,
    sourcePosition: Point,
    edgeTemplate?: Partial<SEdgeSchema>
): void {
    console.log('drawFeedbackPositionedEdge called');
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
    const edgeStart = new FeedbackPositionedEdgeStart(sourcePosition, elementTypeId);
    edgeStart.bounds = {
        x: sourcePosition.x,
        y: sourcePosition.y,
        width: 0,
        height: 0
    };

    // TODO: correct feedback for Messages to self

    edgeStart.id = feedbackEdgeStartId(root);

    const edgeEnd = new FeedbackEdgeEnd(source.id, elementTypeId);
    edgeEnd.id = feedbackEdgeEndId(root);
    edgeEnd.position = toAbsolutePosition(source);

    const edgeSchema: SEdgeSchema = {
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
        console.log('root:', root);
    }
}

export function removeFeedbackEdge(root: SModelRoot): void {
    console.log('removaALLLLLL');
    const feedbackEdge = root.index.getById(feedbackEdgeId(root));
    const feedbackEdgeStart = root.index.getById(feedbackEdgeStartId(root));
    const feedbackEdgeEnd = root.index.getById(feedbackEdgeEndId(root));
    if (feedbackEdge instanceof SChildElement) {
        console.log('edge be gone!');
        root.remove(feedbackEdge);
    }
    if (feedbackEdgeEnd instanceof SChildElement) {
        root.remove(feedbackEdgeEnd);
    }
    if (feedbackEdgeStart instanceof SChildElement) {
        console.log('edgeStart be gone!');
        root.remove(feedbackEdgeStart);
    }
}
export const EDGESTART = 'feedback_anchor_start';

export function feedbackEdgeStartId(root: SModelRoot): string {
    return root.id + '_' + EDGESTART;
}

export class FeedbackPositionedEdgeStart extends SDanglingAnchor {
    static readonly TYPE = EDGESTART;
    constructor(
        readonly sourcePoistion: Point,
        readonly elementTypeId: string,
        public feedbackEdge: SRoutableElement | undefined = undefined,
        override readonly type: string = FeedbackEdgeEnd.TYPE
    ) {
        super();
    }
}

export class FeedbackPositionedEdgeEndMovingMouseListener extends FeedbackEdgeEndMovingMouseListener {
    override mouseMove(target: SModelElement, event: MouseEvent): Action[] {
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
