/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/*
TODO HAYDAR

import {
    type Action,
    Bounds,
    ChangeBoundsTool,
    CursorCSS,
    cursorFeedbackAction,
    Disposable,
    DrawFeedbackEdgeSourceAction,
    EdgeEditListener,
    EdgeEditTool,
    FeedbackEdgeRouteMovingMouseListener,
    FeedbackEdgeSourceMovingMouseListener,
    FeedbackEdgeTargetMovingMouseListener,
    findChildrenAtPosition,
    findParentByFeature,
    GConnectableElement,
    getAbsolutePosition,
    type GModelElement,
    type GReconnectHandle,
    type GRoutableElement,
    HideEdgeReconnectHandlesFeedbackAction,
    isBoundsAware,
    isConnectable,
    isSourceRoutingHandle,
    isTargetRoutingHandle,
    MoveAction,
    Point,
    toAbsoluteBounds
} from '@eclipse-glsp/client';
import { type ISelectionListener } from '@eclipse-glsp/client/lib/base/selection-service.js';
import {
    DrawFeedbackEdgeAction,
    FeedbackEdgeEnd,
    feedbackEdgeEndId
} from '@eclipse-glsp/client/lib/features/tools/edge-creation/dangling-edge-feedback.js';
import { ChangeToolsStateAction } from '../tool-manager/uml-tool-manager.js';

export class UMLEdgeEditTool extends EdgeEditTool {
    static override ID = 'uml.edge-edit-tool';

    override get id(): string {
        return UMLEdgeEditTool.ID;
    }

    override enable(): void {
        this.edgeEditListener = new UMLEdgeEditListener(this);

        // install feedback move mouse listener for client-side move updates
        this.feedbackEdgeSourceMovingListener = new UMLFeedbackEdgeSourceMovingMouseListener(this.anchorRegistry, this.feedbackDispatcher);
        this.feedbackEdgeTargetMovingListener = new UMLFeedbackEdgeTargetMovingMouseListener(this.anchorRegistry, this.feedbackDispatcher);
        this.feedbackMovingListener = new UMLFeedbackEdgeRouteMovingMouseListener(this.positionSnapper, this.edgeRouterRegistry);

        this.toDisposeOnDisable.push(
            Disposable.create(() => this.edgeEditListener.reset()),
            this.mouseTool.registerListener(this.edgeEditListener),
            this.feedbackEdgeSourceMovingListener,
            this.feedbackEdgeTargetMovingListener,
            this.selectionService.onSelectionChanged(change => this.edgeEditListener.selectionChanged(change.root, change.selectedElements))
        );
    }
}

class UMLFeedbackEdgeTargetMovingMouseListener extends FeedbackEdgeTargetMovingMouseListener {
    override mouseMove(target: GModelElement, event: MouseEvent): Action[] {
        const root = target.root;
        const edgeEnd = root.index.getById(feedbackEdgeEndId(root));
        if (!(edgeEnd instanceof FeedbackEdgeEnd) || !edgeEnd.feedbackEdge) {
            return [];
        }

        const edge = edgeEnd.feedbackEdge;
        if (edge.targetId !== edgeEnd.id) {
            return [];
        }

        const position = getAbsolutePosition(edgeEnd, event);
        const endAtMousePosition = findChildrenAtPosition(target.root, position)
            .reverse()
            .find(element => isConnectable(element) && element.canConnect(edge, 'target'));

        if (endAtMousePosition instanceof GConnectableElement && edge.source && isBoundsAware(edge.source)) {
            const anchor = this.computeAbsoluteAnchor(endAtMousePosition, Bounds.center(toAbsoluteBounds(edge.source)));
            if (Point.euclideanDistance(anchor, edgeEnd.position) > 1) {
                return [MoveAction.create([{ elementId: edgeEnd.id, toPosition: anchor }], { animate: false })];
            }
        } else {
            return [MoveAction.create([{ elementId: edgeEnd.id, toPosition: position }], { animate: false })];
        }

        return [];
    }
}

class UMLFeedbackEdgeSourceMovingMouseListener extends FeedbackEdgeSourceMovingMouseListener {
    override mouseMove(target: GModelElement, event: MouseEvent): Action[] {
        const root = target.root;
        const edgeEnd = root.index.getById(feedbackEdgeEndId(root));
        if (!(edgeEnd instanceof FeedbackEdgeEnd) || !edgeEnd.feedbackEdge) {
            return [];
        }

        const edge = edgeEnd.feedbackEdge;
        if (edge.sourceId !== edgeEnd.id) {
            return [];
        }
        const position = getAbsolutePosition(edgeEnd, event);
        const endAtMousePosition = findChildrenAtPosition(target.root, position).find(
            e => isConnectable(e) && e.canConnect(edge, 'source')
        );

        if (endAtMousePosition instanceof GConnectableElement && edge.target && isBoundsAware(edge.target)) {
            const anchor = this.computeAbsoluteAnchor(endAtMousePosition, Bounds.center(edge.target.bounds));
            if (Point.euclideanDistance(anchor, edgeEnd.position) > 1) {
                return [MoveAction.create([{ elementId: edgeEnd.id, toPosition: anchor }], { animate: false })];
            }
        } else {
            return [MoveAction.create([{ elementId: edgeEnd.id, toPosition: position }], { animate: false })];
        }

        return [];
    }
}

class UMLFeedbackEdgeRouteMovingMouseListener extends FeedbackEdgeRouteMovingMouseListener {}

class UMLEdgeEditListener extends EdgeEditListener implements ISelectionListener {
    protected disableToolList: string[] = [ChangeBoundsTool.ID];

    protected override setReconnectHandleSelected(edge: GRoutableElement, reconnectHandle: GReconnectHandle): void {
        if (this.edge && this.edge.target && this.edge.source) {
            if (isSourceRoutingHandle(edge, reconnectHandle)) {
                this.tool.registerFeedback([
                    HideEdgeReconnectHandlesFeedbackAction.create(),
                    cursorFeedbackAction(CursorCSS.EDGE_RECONNECT),
                    DrawFeedbackEdgeSourceAction.create({ elementTypeId: this.edge.type, targetId: this.edge.targetId })
                ]);
                this.reconnectMode = 'NEW_SOURCE';
            } else if (isTargetRoutingHandle(edge, reconnectHandle)) {
                this.tool.registerFeedback([
                    HideEdgeReconnectHandlesFeedbackAction.create(),
                    cursorFeedbackAction(CursorCSS.EDGE_CREATION_TARGET),
                    DrawFeedbackEdgeAction.create({ elementTypeId: this.edge.type, sourceId: this.edge.sourceId })
                ]);
                this.reconnectMode = 'NEW_TARGET';
            }

            this.tool.dispatchActions([ChangeToolsStateAction.create(this.disableToolList, false)]);
        }
    }

    override mouseUp(target: GModelElement, event: MouseEvent): Action[] {
        if (this.newConnectable === undefined) {
            this.mouseOver(target, event);
        }

        return super.mouseUp(target, event);
    }

    override mouseOver(target: GModelElement, _event: MouseEvent): Action[] {
        if (this.edge && this.isReconnecting()) {
            const currentTarget = findParentByFeature(target, isConnectable);
            if (!this.newConnectable || currentTarget !== this.newConnectable) {
                if (currentTarget) {
                    if (
                        (this.reconnectMode === 'NEW_SOURCE' && currentTarget.canConnect(this.edge, 'source')) ||
                        (this.reconnectMode === 'NEW_TARGET' && currentTarget.canConnect(this.edge, 'target'))
                    ) {
                        this.setNewConnectable(currentTarget);
                        this.tool.registerFeedback([cursorFeedbackAction(CursorCSS.EDGE_RECONNECT)]);
                        return [];
                    }
                }
                this.tool.registerFeedback([cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)]);
            } else if (currentTarget === this.newConnectable) {
                this.tool.registerFeedback([cursorFeedbackAction(CursorCSS.EDGE_RECONNECT)]);
            }
        }
        return [];
    }

    public override reset(): void {
        this.tool.dispatchActions([ChangeToolsStateAction.create(this.disableToolList, true)]);
        this.resetFeedback();
        this.resetData();
    }
}
*/
