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
/** @jsx svg */
import { RectangularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { type SDVerticalShiftNode } from './model.js';

// TODO: Sequence Diagram Specific

const markerColor = 'LightSlateGrey';

@injectable()
export class SDVerticalShiftView extends RectangularNodeView {
    override render(node: SDVerticalShiftNode, _context: RenderingContext): VNode {
        const graph = (
            <g>
                <defs>
                    <marker
                        id='marker-triangle-shift-tool'
                        viewBox='0 0 10 10'
                        refX='10'
                        refY='5'
                        markerUnits='userSpaceOnUse'
                        markerWidth='10'
                        markerHeight='10'
                        orient='auto-start-reverse'
                    >
                        <path d='M 0 0 L 10 5 L 0 10 L 0 0 z' fill={markerColor} stroke='none' />
                    </marker>
                </defs>
                <line
                    class-shift-tool={true}
                    x1={-10000} // TODO: set width of current view instead of hardcoded
                    x2={10000}
                    y1={node.startPoint.y}
                    y2={node.startPoint.y}
                ></line>
                <line class-shift-tool={true} x1={-10000} x2={10000} y1={node.endPoint.y} y2={node.endPoint.y}></line>
                <line
                    class-shift-tool-direction={true}
                    x1={node.startPoint.x}
                    x2={node.startPoint.x}
                    y1={node.startPoint.y}
                    y2={node.endPoint.y}
                ></line>
            </g>
        );
        return graph;
    }
}

@injectable()
export class SDHorizontalShiftView extends RectangularNodeView {
    override render(node: SDVerticalShiftNode, _context: RenderingContext): VNode {
        const graph = (
            <g class-colorful-marker={true}>
                <defs>
                    <marker
                        id='marker-triangle-shift-tool'
                        viewBox='0 0 10 10'
                        refX='10'
                        refY='5'
                        markerUnits='userSpaceOnUse'
                        markerWidth='10'
                        markerHeight='10'
                        orient='auto-start-reverse'
                    >
                        <path d='M 0 0 L 10 5 L 0 10 L 0 0 z' fill={markerColor} stroke='none' />
                    </marker>
                </defs>
                <line class-shift-tool={true} x1={node.startPoint.x} x2={node.startPoint.x} y1={-10000} y2={10000}></line>
                <line class-shift-tool={true} x1={node.endPoint.x} x2={node.endPoint.x} y1={-10000} y2={10000}></line>
                <line
                    class-shift-tool-direction={true}
                    x1={node.startPoint.x}
                    x2={node.endPoint.x}
                    y1={node.startPoint.y}
                    y2={node.startPoint.y}
                ></line>
            </g>
        );
        return graph;
    }
}
