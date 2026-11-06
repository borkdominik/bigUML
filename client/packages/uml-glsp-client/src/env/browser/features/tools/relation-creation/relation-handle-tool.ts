/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RequestRelationTypesAction } from '@borkdominik-biguml/uml-glsp-server';
import {
    type Action,
    BaseEditTool,
    Disposable,
    type FeedbackEmitter,
    GEdge,
    type GModelElement,
    type GModelRoot,
    GShapeElement,
    isConnectable,
    MouseListener,
    SelectionService
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { StartRelationCreationAction } from './relation-creation-tool.js';
import { HideRelationHandlesAction, ShowRelationHandlesAction } from './relation-handle-feedback.js';
import { isRelationHandle } from './relation-handle.js';

/**
 * Shows arrows around the selected shape that a relation can be drawn from, the way the tool palette's
 * "Create relation" does - only started from the shape itself. Pressing an arrow starts the
 * `RelationCreationTool` with the shape as the source: clicking a target then, or dragging the arrow
 * onto one and letting go, creates the relation.
 *
 * A default tool, so the arrows are there while the diagram is being selected and moved about, and gone
 * as soon as any other tool is in use. They are shown for one selected shape at a time, and only where
 * some relation of the diagram may start at it - which is the server's answer, as it is for the tool.
 */
@injectable()
export class RelationHandleTool extends BaseEditTool {
    static readonly ID = 'tool_relation_handles';

    @inject(SelectionService) protected readonly selectionService: SelectionService;

    /** The arrows shown, and the shape they are shown on. */
    protected handles?: { elementId: string; feedback: FeedbackEmitter };
    /** The shape the server is being asked about, while the answer is outstanding. */
    protected pendingElementId?: string;

    get id(): string {
        return RelationHandleTool.ID;
    }

    enable(): void {
        this.toDisposeOnDisable.push(
            this.selectionService.addListener({ selectionChanged: (root, selected) => this.update(root, selected) }),
            this.mouseTool.registerListener(new RelationHandleMouseListener()),
            Disposable.create(() => this.hide())
        );
        const selected = this.selectionService.getSelectedElementIDs();
        if (selected.length > 0) {
            this.update(this.editorContext.modelRoot, selected);
        }
    }

    protected update(root: Readonly<GModelRoot>, selectedElementIds: string[]): void {
        const element = selectedElementIds.length === 1 ? root.index.getById(selectedElementIds[0]) : undefined;
        if (!element || !this.mayHaveHandles(element)) {
            this.hide();
            return;
        }
        if (element.id === this.handles?.elementId || element.id === this.pendingElementId) {
            return;
        }

        this.hide();
        const elementId = element.id;
        this.pendingElementId = elementId;
        this.actionDispatcher
            .request(RequestRelationTypesAction.create({ sourceElementId: elementId }))
            .then(response => {
                if (this.pendingElementId !== elementId) {
                    return;
                }
                this.pendingElementId = undefined;
                if (response.relationTypes.length > 0) {
                    const feedback = this.createFeedbackEmitter()
                        .add(ShowRelationHandlesAction.create(elementId), HideRelationHandlesAction.create())
                        .submit();
                    this.handles = { elementId, feedback };
                }
            })
            .catch(error => {
                if (this.pendingElementId === elementId) {
                    this.pendingElementId = undefined;
                }
                console.error('Could not determine whether a relation can start at the selected element:', error);
            });
    }

    /** A shape that edges are drawn to - not an edge, and not the canvas. */
    protected mayHaveHandles(element: GModelElement): boolean {
        return element instanceof GShapeElement && !(element instanceof GEdge) && isConnectable(element);
    }

    protected hide(): void {
        this.pendingElementId = undefined;
        this.handles?.feedback.dispose();
        this.handles = undefined;
    }
}

/** Starts drawing a relation from the shape whose arrow is pressed. */
class RelationHandleMouseListener extends MouseListener {
    override mouseDown(target: GModelElement, event: MouseEvent): Action[] {
        if (event.button === 0 && isRelationHandle(target)) {
            return [StartRelationCreationAction.create(target.parent.id)];
        }
        return [];
    }
}
