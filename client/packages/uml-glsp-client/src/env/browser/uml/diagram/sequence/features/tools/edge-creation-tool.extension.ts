/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    CursorCSS,
    cursorFeedbackAction,
    EdgeCreationTool,
    EdgeCreationToolMouseListener,
    EnableDefaultToolsAction,
    FeedbackEdgeEndMovingMouseListener,
    findParentByFeature,
    getAbsolutePosition,
    type GModelElement,
    isCtrlOrCmd,
    type ISnapper,
    TYPES
} from '@eclipse-glsp/client';
import {
    DrawFeedbackEdgeAction,
    RemoveFeedbackEdgeAction
} from '@eclipse-glsp/client/lib/features/tools/edge-creation/dangling-edge-feedback.js';
import { type Action, CreateEdgeOperation, type Point } from '@eclipse-glsp/protocol';
import { inject, injectable, optional } from 'inversify';
import { sequence } from '../../elements/index.js';
import { isSequence } from '../../elements/interacton.model.js';
import {
    SDDrawFeedbackPositionedEdgeAction,
    SDFeedbackPositionedEdgeEndMovingMouseListener,
    SDRemoveFeedbackPositionedEdgeAction
} from '../tool-feedback/creation-tool-feedback.extension.js';

// TODO: Sequence Diagram Specific
/**
 * Tool to create connections in a Diagram, by selecting a source and target node.
 */
@injectable()
export class SDEdgeCreationTool extends EdgeCreationTool {
    @inject(TYPES.ISnapper) @optional() readonly snapper?: ISnapper;

    protected createEdgeCreationToolMouseListener(): EdgeCreationToolMouseListener {
        return new SDEdgeCreationToolMouseListener(this.triggerAction, this.actionDispatcher, this.typeHintProvider, this);
    }

    override doEnable(): void {
        let mouseMovingFeedback = new FeedbackEdgeEndMovingMouseListener(this.anchorRegistry, this.feedbackDispatcher);
        const extendedEdgeFeedback = [
            'edge:sequence__Message',
            'edge:sequence__reply__Message',
            'edge:sequence__sync__Message',
            'edge:sequence__create__Message',
            'edge:sequence__delete__Message',
            'edge:sequence__found__Message',
            'edge:sequence__lost__Message'
        ];
        if (extendedEdgeFeedback.includes(this.triggerAction.elementTypeId)) {
            mouseMovingFeedback = new SDFeedbackPositionedEdgeEndMovingMouseListener(this.anchorRegistry, this.feedbackDispatcher);
        } else {
            mouseMovingFeedback = new FeedbackEdgeEndMovingMouseListener(this.anchorRegistry, this.feedbackDispatcher);
        }

        this.toDisposeOnDisable.push(
            mouseMovingFeedback,
            this.mouseTool.registerListener(this.createEdgeCreationToolMouseListener()),
            this.mouseTool.registerListener(mouseMovingFeedback),
            this.registerFeedback([cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)], this, [
                RemoveFeedbackEdgeAction.create(),
                cursorFeedbackAction()
            ])
        );
    }
}

@injectable()
export class SDEdgeCreationToolMouseListener extends EdgeCreationToolMouseListener {
    protected sourcePosition?: Point;
    protected targetPosition?: Point;

    override dispose(): void {
        this.sourcePosition = undefined;
        this.targetPosition = undefined;
        this.tool.registerFeedback([SDRemoveFeedbackPositionedEdgeAction.create()]);
        super.dispose();
    }

    override nonDraggingMouseUp(_element: GModelElement, event: MouseEvent): Action[] {
        const result: Action[] = [];
        if (event.button === 0) {
            if (!this.isSourceSelected()) {
                if (this.currentTarget && this.allowedTarget) {
                    const sourcePoint = getAbsolutePosition(_element, event);
                    this.source = this.currentTarget.id;
                    this.sourcePosition = sourcePoint;
                    if (_element.features?.has(sequence) || findParentByFeature(_element, isSequence) !== undefined) {
                        this.tool.registerFeedback([
                            SDDrawFeedbackPositionedEdgeAction.create({
                                elementTypeId: this.triggerAction.elementTypeId,
                                sourceId: this.source,
                                sourcePosition: this.sourcePosition
                            })
                        ]);
                    } else {
                        this.tool.registerFeedback([
                            DrawFeedbackEdgeAction.create({ elementTypeId: this.triggerAction.elementTypeId, sourceId: this.source })
                        ]);
                    }
                }
            } else {
                if (this.currentTarget && this.allowedTarget) {
                    const targetPoint = getAbsolutePosition(_element, event);
                    this.target = this.currentTarget.id;
                    this.targetPosition = targetPoint;
                }
            }
            if (this.source && this.target && this.sourcePosition && this.targetPosition) {
                if (!event.altKey && this.source !== this.target) {
                    /* Default: horizontal Message*/
                    result.push(
                        CreateEdgeOperation.create({
                            elementTypeId: this.triggerAction.elementTypeId,
                            sourceElementId: this.source,
                            targetElementId: this.target,
                            args: {
                                ...this.triggerAction.args,
                                sourcePosition: this.stringify(this.sourcePosition),
                                targetPosition: this.stringify({ x: this.targetPosition.x, y: this.sourcePosition.y })
                            }
                        })
                    );
                } else {
                    /* Diagonal Message with Alt modifier*/
                    result.push(
                        CreateEdgeOperation.create({
                            elementTypeId: this.triggerAction.elementTypeId,
                            sourceElementId: this.source,
                            targetElementId: this.target,
                            args: {
                                ...this.triggerAction.args,
                                sourcePosition: this.stringify(this.sourcePosition),
                                targetPosition: this.stringify(this.targetPosition)
                            }
                        })
                    );
                }

                if (!isCtrlOrCmd(event)) {
                    result.push(EnableDefaultToolsAction.create());
                } else {
                    this.dispose();
                }
            }
        } else if (event.button === 2) {
            result.push(EnableDefaultToolsAction.create());
        }
        return result;
    }
    stringify(point: Point): string {
        return point.x + ',' + point.y;
    }
}
