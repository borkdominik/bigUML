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
import {
    CursorCSS,
    cursorFeedbackAction,
    DrawFeedbackEdgeAction,
    EdgeCreationTool,
    EdgeCreationToolMouseListener,
    EnableDefaultToolsAction,
    FeedbackEdgeEndMovingMouseListener,
    findParentByFeature,
    getAbsolutePosition,
    isCtrlOrCmd,
    ISnapper,
    SModelElement,
    TYPES
} from '@eclipse-glsp/client';
import { Action, CreateEdgeOperation, Point, TriggerEdgeCreationAction } from '@eclipse-glsp/protocol';
import { inject, injectable, optional } from 'inversify';
import { sequence } from '../../uml/diagram/sequence/elements';
import { isSequence } from '../../uml/diagram/sequence/elements/interacton.model';
import {
    DrawFeedbackPositionedEdgeAction,
    FeedbackPositionedEdgeEndMovingMouseListener,
    RemoveFeedbackPositionedEdgeAction
} from '../tool-feedback/creation-tool-feedback.extension';

/**
 * Tool to create connections in a Diagram, by selecting a source and target node.
 */
@injectable()
export class UmlEdgeCreationTool extends EdgeCreationTool {
    @inject(TYPES.ISnapper) @optional() readonly snapper?: ISnapper;

    protected override creationToolMouseListener: UmlEdgeCreationToolMouseListener;

    override enable(): void {
        if (this.triggerAction === undefined) {
            throw new TypeError(`Could not enable tool ${this.id}.The triggerAction cannot be undefined.`);
        }
        this.creationToolMouseListener = new UmlEdgeCreationToolMouseListener(this.triggerAction, this);
        this.mouseTool.register(this.creationToolMouseListener);
        console.log('looking for:', this.triggerAction.elementTypeId);
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
            console.log('assigned FeedbackPositionedEdgeEndMovingMouseListener');
            this.feedbackEndMovingMouseListener = new FeedbackPositionedEdgeEndMovingMouseListener(this.anchorRegistry);
        } else {
            this.feedbackEndMovingMouseListener = new FeedbackEdgeEndMovingMouseListener(this.anchorRegistry);
        }
        this.mouseTool.register(this.feedbackEndMovingMouseListener);
        this.dispatchFeedback([cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)]);
    }
}

@injectable()
export class UmlEdgeCreationToolMouseListener extends EdgeCreationToolMouseListener {
    protected sourceLocation?: Point;
    protected targetLocation?: Point;

    constructor(protected override triggerAction: TriggerEdgeCreationAction, protected override tool: UmlEdgeCreationTool) {
        super(triggerAction, tool);
        // this.proxyEdge = new SEdge();
        // this.proxyEdge.type = triggerAction.elementTypeId;
    }

    protected override reinitialize(): void {
        this.source = undefined;
        this.target = undefined;
        this.sourceLocation = undefined;
        this.targetLocation = undefined;
        this.currentTarget = undefined;
        this.allowedTarget = false;
        this.tool.dispatchFeedback([RemoveFeedbackPositionedEdgeAction.create()]);
    }

    override nonDraggingMouseUp(_element: SModelElement, event: MouseEvent): Action[] {
        const result: Action[] = [];
        if (event.button === 0) {
            if (!this.isSourceSelected()) {
                if (this.currentTarget && this.allowedTarget) {
                    const sourcePoint = getAbsolutePosition(_element, event);
                    this.source = this.currentTarget.id;
                    this.sourceLocation = sourcePoint;
                    if (_element.features?.has(sequence) || findParentByFeature(_element, isSequence) !== undefined) {
                        this.tool.dispatchFeedback([
                            DrawFeedbackPositionedEdgeAction.create({
                                elementTypeId: this.triggerAction.elementTypeId,
                                sourceId: this.source,
                                sourcePosition: this.sourceLocation
                            })
                        ]);
                    } else {
                        this.tool.dispatchFeedback([
                            DrawFeedbackEdgeAction.create({ elementTypeId: this.triggerAction.elementTypeId, sourceId: this.source })
                        ]);
                    }
                }
            } else {
                if (this.currentTarget && this.allowedTarget) {
                    const targetPoint = getAbsolutePosition(_element, event);
                    this.target = this.currentTarget.id;
                    this.targetLocation = targetPoint;
                }
            }
            if (this.source && this.target && this.sourceLocation && this.targetLocation) {
                if (!event.altKey && this.source !== this.target) {
                    /* Default: horizontal Message*/
                    result.push(
                        CreateEdgeOperation.create({
                            elementTypeId: this.triggerAction.elementTypeId,
                            sourceElementId: this.source,
                            targetElementId: this.target,
                            args: {
                                ...this.triggerAction.args,
                                sourceLocation: this.stringify(this.sourceLocation),
                                targetLocation: this.stringify({ x: this.targetLocation.x, y: this.sourceLocation.y })
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
                                sourceLocation: this.stringify(this.sourceLocation),
                                targetLocation: this.stringify(this.targetLocation)
                            }
                        })
                    );
                }

                if (!isCtrlOrCmd(event)) {
                    result.push(EnableDefaultToolsAction.create());
                } else {
                    this.reinitialize();
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
