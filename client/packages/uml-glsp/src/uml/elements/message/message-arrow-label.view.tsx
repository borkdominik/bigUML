/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    EdgeRouterRegistry,
    getSubType,
    Point,
    RenderingContext,
    RoutedPoint,
    SEdge,
    setAttr,
    SLabelView,
    svg
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { SEditableLabel } from '../../../graph/index';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class MessageArrowLabelView extends SLabelView {
    @inject(EdgeRouterRegistry) edgeRouterRegistry: EdgeRouterRegistry;

    override render(labelNode: Readonly<SEditableLabel>, context: RenderingContext): VNode {
        let rotation = 0;
        if (labelNode.edgePlacement !== undefined) {
            const parent = labelNode.parent as SEdge;
            const segments = this.edgeRouterRegistry.route(parent);
            const router = this.edgeRouterRegistry.get(parent.routerKind);

            const position = router.pointAt(parent, labelNode.edgePlacement.position);
            if (position !== undefined) {
                rotation = this.getRotation(position, segments);
            }
        }

        const vnode: any = (
            <g class-selected={labelNode.selected} class-sprotty-label-node={true}>
                <defs>
                    <g id='arrow-right'>
                        <path d='M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z' />
                    </g>
                </defs>

                <text class-sprotty-label={true} x={0} y={-8}>
                    {labelNode.text}
                </text>

                <use
                    href='#arrow-right'
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    transform={`translate(-12) rotate(${rotation})`}
                    transform-origin='12 12'
                />
            </g>
        );

        const subType = getSubType(labelNode);
        if (subType) {
            setAttr(vnode, 'class', subType);
        }
        return vnode;
    }

    private getRotation(point: Point, segments: RoutedPoint[]): number {
        const sameX = segments.filter(segment => Math.abs(segment.x - point.x) < 0.01);
        const sameY = segments.filter(segment => Math.abs(segment.y - point.y) < 0.01);

        if (sameX.length === 2) {
            return sameX[0].y > sameX[1].y ? -90 : 90;
        } else if (sameY.length === 2) {
            return sameY[0].x > sameY[1].x ? -180 : 0;
        } else {
            return 0;
        }
    }
}
