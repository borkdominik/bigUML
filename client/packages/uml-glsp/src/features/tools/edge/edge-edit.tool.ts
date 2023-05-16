/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    Action,
    AnchorComputerRegistry,
    BaseGLSPTool,
    calcElementAndRoutingPoints,
    canEditRouting,
    ChangeBoundsTool,
    ChangeRoutingPointsOperation,
    Connectable,
    CursorCSS,
    cursorFeedbackAction,
    DragAwareMouseListener,
    DrawFeedbackEdgeAction,
    DrawFeedbackEdgeSourceAction,
    EdgeEditTool,
    EdgeRouterRegistry,
    feedbackEdgeId,
    FeedbackEdgeRouteMovingMouseListener,
    FeedbackEdgeSourceMovingMouseListener,
    FeedbackEdgeTargetMovingMouseListener,
    findParentByFeature,
    HideEdgeReconnectHandlesFeedbackAction,
    isConnectable,
    ISnapper,
    isReconnectable,
    isReconnectHandle,
    isRoutable,
    isRoutingHandle,
    isSelected,
    isSourceRoutingHandle,
    isTargetRoutingHandle,
    ReconnectEdgeOperation,
    RemoveFeedbackEdgeAction,
    ShowEdgeReconnectHandlesFeedbackAction,
    SModelElement,
    SModelRoot,
    SReconnectHandle,
    SRoutableElement,
    SRoutingHandle,
    SwitchRoutingModeAction,
    TYPES
} from '@eclipse-glsp/client';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, optional } from 'inversify';
import { ChangeToolsStateAction } from '../tool-manager';

export class UmlEdgeEditTool extends BaseGLSPTool {
    static ID = 'uml.edge-edit-tool';

    @inject(TYPES.SelectionService) protected selectionService: SelectionService;
    @inject(AnchorComputerRegistry) protected anchorRegistry: AnchorComputerRegistry;
    @inject(EdgeRouterRegistry) @optional() readonly edgeRouterRegistry?: EdgeRouterRegistry;
    @inject(TYPES.ISnapper) @optional() readonly snapper?: ISnapper;

    protected feedbackEdgeSourceMovingListener: FeedbackEdgeSourceMovingMouseListener;
    protected feedbackEdgeTargetMovingListener: FeedbackEdgeTargetMovingMouseListener;
    protected feedbackMovingListener: FeedbackEdgeRouteMovingMouseListener;
    protected edgeEditListener: EdgeEditListener;

    get id(): string {
        return EdgeEditTool.ID;
    }

    enable(): void {
        this.edgeEditListener = new EdgeEditListener(this);
        this.mouseTool.register(this.edgeEditListener);
        this.selectionService.register(this.edgeEditListener);

        // install feedback move mouse listener for client-side move updates
        this.feedbackEdgeSourceMovingListener = new FeedbackEdgeSourceMovingMouseListener(this.anchorRegistry);
        this.feedbackEdgeTargetMovingListener = new FeedbackEdgeTargetMovingMouseListener(this.anchorRegistry);
        this.feedbackMovingListener = new FeedbackEdgeRouteMovingMouseListener(this.edgeRouterRegistry, this.snapper);
    }

    registerFeedbackListeners(): void {
        this.mouseTool.register(this.feedbackMovingListener);
        this.mouseTool.register(this.feedbackEdgeSourceMovingListener);
        this.mouseTool.register(this.feedbackEdgeTargetMovingListener);
    }

    deregisterFeedbackListeners(): void {
        this.mouseTool.deregister(this.feedbackEdgeSourceMovingListener);
        this.mouseTool.deregister(this.feedbackEdgeTargetMovingListener);
        this.mouseTool.deregister(this.feedbackMovingListener);
    }

    disable(): void {
        this.edgeEditListener.reset();
        this.selectionService.deregister(this.edgeEditListener);
        this.deregisterFeedbackListeners();
        this.mouseTool.deregister(this.edgeEditListener);
    }
}

class EdgeEditListener extends DragAwareMouseListener implements SelectionListener {
    protected disableToolList: string[] = [ChangeBoundsTool.ID];

    // active selection data
    protected edge?: SRoutableElement;
    protected routingHandle?: SRoutingHandle;

    // new connectable (source or target) for edge
    protected newConnectable?: SModelElement & Connectable;

    // active reconnect handle data
    protected reconnectMode?: 'NEW_SOURCE' | 'NEW_TARGET';

    constructor(protected tool: UmlEdgeEditTool) {
        super();
    }

    protected isValidEdge(edge?: SRoutableElement): edge is SRoutableElement {
        return edge !== undefined && edge.id !== feedbackEdgeId(edge.root) && isSelected(edge);
    }

    protected setEdgeSelected(edge: SRoutableElement): void {
        if (this.edge && this.edge.id !== edge.id) {
            // reset from a previously selected edge
            this.reset();
        }

        this.edge = edge;
        // note: order is important here as we want the reconnect handles to cover the routing handles
        const feedbackActions = [];
        if (canEditRouting(edge)) {
            feedbackActions.push(SwitchRoutingModeAction.create({ elementsToActivate: [this.edge.id] }));
        }
        if (isReconnectable(edge)) {
            feedbackActions.push(ShowEdgeReconnectHandlesFeedbackAction.create(this.edge.id));
        }
        this.tool.dispatchFeedback(feedbackActions);
    }

    protected isEdgeSelected(): boolean {
        return this.edge !== undefined && isSelected(this.edge);
    }

    protected setReconnectHandleSelected(edge: SRoutableElement, reconnectHandle: SReconnectHandle): void {
        if (this.edge && this.edge.target && this.edge.source) {
            if (isSourceRoutingHandle(edge, reconnectHandle)) {
                this.tool.dispatchFeedback([
                    HideEdgeReconnectHandlesFeedbackAction.create(),
                    cursorFeedbackAction(CursorCSS.EDGE_RECONNECT),
                    DrawFeedbackEdgeSourceAction.create({ elementTypeId: this.edge.type, targetId: this.edge.targetId })
                ]);
                this.reconnectMode = 'NEW_SOURCE';
            } else if (isTargetRoutingHandle(edge, reconnectHandle)) {
                this.tool.dispatchFeedback([
                    HideEdgeReconnectHandlesFeedbackAction.create(),
                    cursorFeedbackAction(CursorCSS.EDGE_CREATION_TARGET),
                    DrawFeedbackEdgeAction.create({ elementTypeId: this.edge.type, sourceId: this.edge.sourceId })
                ]);
                this.reconnectMode = 'NEW_TARGET';
            }

            this.tool.dispatchActions([ChangeToolsStateAction.create(this.disableToolList, false)]);
        }
    }

    protected isReconnecting(): boolean {
        return this.reconnectMode !== undefined;
    }

    protected isReconnectingNewSource(): boolean {
        return this.reconnectMode === 'NEW_SOURCE';
    }

    protected setRoutingHandleSelected(edge: SRoutableElement, routingHandle: SRoutingHandle): void {
        if (this.edge && this.edge.target && this.edge.source) {
            this.routingHandle = routingHandle;
        }
    }

    protected requiresReconnect(sourceId: string, targetId: string): boolean {
        return this.edge !== undefined && (this.edge.sourceId !== sourceId || this.edge.targetId !== targetId);
    }

    protected setNewConnectable(connectable?: SModelElement & Connectable): void {
        this.newConnectable = connectable;
    }

    protected isReadyToReconnect(): boolean | undefined {
        return this.edge && this.isReconnecting() && this.newConnectable !== undefined;
    }

    protected isReadyToReroute(): boolean {
        return this.routingHandle !== undefined;
    }

    override mouseDown(target: SModelElement, event: MouseEvent): Action[] {
        const result: Action[] = super.mouseDown(target, event);
        if (event.button === 0) {
            const reconnectHandle = findParentByFeature(target, isReconnectHandle);
            const routingHandle = !reconnectHandle ? findParentByFeature(target, isRoutingHandle) : undefined;
            const edge = findParentByFeature(target, isRoutable);
            if (this.isEdgeSelected() && edge && reconnectHandle) {
                // PHASE 2 Reconnect: Select reconnect handle on selected edge
                this.setReconnectHandleSelected(edge, reconnectHandle);
            } else if (this.isEdgeSelected() && edge && routingHandle) {
                // PHASE 2 Reroute: Select routing handle on selected edge
                this.setRoutingHandleSelected(edge, routingHandle);
            } else if (this.isValidEdge(edge)) {
                // PHASE 1: Select edge
                this.tool.registerFeedbackListeners();
                this.setEdgeSelected(edge);
            }
        } else if (event.button === 2) {
            this.reset();
        }
        return result;
    }

    override mouseMove(target: SModelElement, event: MouseEvent): Action[] {
        const result = super.mouseMove(target, event);
        if (this.isMouseDrag) {
            // reset any selected connectables when we are dragging, maybe the user is just panning
            this.setNewConnectable(undefined);
        }
        return result;
    }

    override mouseUp(target: SModelElement, event: MouseEvent): Action[] {
        const result = super.mouseUp(target, event);
        if (!this.isReadyToReconnect() && !this.isReadyToReroute()) {
            return result;
        }

        if (this.edge && this.newConnectable) {
            const sourceElementId = this.isReconnectingNewSource() ? this.newConnectable.id : this.edge.sourceId;
            const targetElementId = this.isReconnectingNewSource() ? this.edge.targetId : this.newConnectable.id;
            if (this.requiresReconnect(sourceElementId, targetElementId)) {
                result.push(ReconnectEdgeOperation.create({ edgeElementId: this.edge.id, sourceElementId, targetElementId }));
            }
            this.reset();
        } else if (this.edge && this.routingHandle) {
            // we need to re-retrieve the edge as it might have changed due to a server update since we do not reset the state between
            // reroute actions
            const latestEdge = target.index.getById(this.edge.id);
            if (latestEdge && isRoutable(latestEdge)) {
                const newRoutingPoints = calcElementAndRoutingPoints(latestEdge, this.tool.edgeRouterRegistry);
                result.push(ChangeRoutingPointsOperation.create([newRoutingPoints]));
                this.routingHandle = undefined;
            }
        }
        return result;
    }

    override mouseOver(target: SModelElement, _event: MouseEvent): Action[] {
        if (this.edge && this.isReconnecting()) {
            const currentTarget = findParentByFeature(target, isConnectable);
            if (!this.newConnectable || currentTarget !== this.newConnectable) {
                this.setNewConnectable(currentTarget);
                if (currentTarget) {
                    if (
                        (this.reconnectMode === 'NEW_SOURCE' && currentTarget.canConnect(this.edge, 'source')) ||
                        (this.reconnectMode === 'NEW_TARGET' && currentTarget.canConnect(this.edge, 'target'))
                    ) {
                        this.tool.dispatchFeedback([cursorFeedbackAction(CursorCSS.EDGE_RECONNECT)]);
                        return [];
                    }
                }
                this.tool.dispatchFeedback([cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)]);
            }
        }
        return [];
    }

    selectionChanged(root: Readonly<SModelRoot>, selectedElements: string[]): void {
        if (this.edge) {
            if (selectedElements.indexOf(this.edge.id) > -1) {
                // our active edge is still selected, nothing to do
                return;
            }

            if (this.isReconnecting()) {
                // we are reconnecting, so we may have clicked on a potential target
                return;
            }

            // try to find some other selected element and mark that active
            for (const elementId of selectedElements.reverse()) {
                const element = root.index.getById(elementId);
                if (element) {
                    const edge = findParentByFeature(element, isRoutable);
                    if (this.isValidEdge(edge)) {
                        // PHASE 1: Select edge
                        this.setEdgeSelected(edge);
                        return;
                    }
                }
            }

            this.reset();
        }
    }

    public reset(): void {
        this.tool.dispatchActions([ChangeToolsStateAction.create(this.disableToolList, true)]);
        this.resetFeedback();
        this.resetData();
    }

    protected resetData(): void {
        this.edge = undefined;
        this.reconnectMode = undefined;
        this.newConnectable = undefined;
        this.routingHandle = undefined;
    }

    protected resetFeedback(): void {
        const result: Action[] = [];
        if (this.edge) {
            result.push(SwitchRoutingModeAction.create({ elementsToDeactivate: [this.edge.id] }));
        }
        result.push(...[HideEdgeReconnectHandlesFeedbackAction.create(), cursorFeedbackAction(), RemoveFeedbackEdgeAction.create()]);
        this.tool.deregisterFeedback(result);
        this.tool.deregisterFeedbackListeners();
    }
}
