/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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
    ElementMove,
    FeedbackMoveMouseListener,
    MoveAction,
    SModelElement,
    findParentByFeature,
    isMoveable,
    isViewport
} from '@eclipse-glsp/client';

export class UmlFeedbackMoveMouseListener extends FeedbackMoveMouseListener {
    protected override getElementMoves(target: SModelElement, event: MouseEvent, finished: boolean): MoveAction | undefined {
        if (!this.startDragPosition) {
            return undefined;
        }
        console.log('shift: ', event.shiftKey, ' alt: ', event.altKey);
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
                        console.log('pressing ALT');
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
}
