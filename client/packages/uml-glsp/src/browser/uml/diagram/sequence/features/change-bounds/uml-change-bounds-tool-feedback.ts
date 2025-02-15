/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { FeedbackMoveMouseListener } from '@eclipse-glsp/client';

// TODO: Sequence Diagram Specific - NOT USED
export class SDFeedbackMoveMouseListener extends FeedbackMoveMouseListener {
    /*
    protected override getElementMoves(target: GModelElement, event: MouseEvent, finished: boolean): MoveAction | undefined {
        if (!this.startDragPosition) {
            return undefined;
        }
        const elementMoves: ElementMove[] = [];
        const viewport = findParentByFeature(target, isViewport);
        const zoom = viewport ? viewport.zoom : 1;
        const delta = {
            x: (event.pageX - this.startDragPosition.x) / zoom,
            y: (event.pageY - this.startDragPosition.y) / zoom
        };
        this.elementId2startPos.forEach((startPosition, elementId) => {
            const element = target.root.index.getById(elementId);
            if (element) {
                let toPosition = this.snap(
                    {
                        x: startPosition.x + delta.x,
                        y: startPosition.y + delta.y
                    },
                    element,
                    !event.shiftKey
                );

                if (isMoveable(element)) {
                    if (event.altKey) {
                        toPosition = this.validateMove(startPosition, toPosition, element, finished);
                        elementMoves.push({
                            elementId: element.id,
                            fromPosition: {
                                x: element.position.x,
                                y: element.position.y
                            },
                            toPosition
                        });
                    } else {
                        toPosition = this.validateMove(startPosition, toPosition, element, finished);
                        elementMoves.push({
                            elementId: element.id,
                            fromPosition: {
                                x: element.position.x,
                                y: element.position.y
                            },
                            toPosition
                        });
                    }
                }
            }
        });
        if (elementMoves.length > 0) {
            return MoveAction.create(elementMoves, { animate: false, finished });
        } else {
            return undefined;
        }
    }
    */
}
