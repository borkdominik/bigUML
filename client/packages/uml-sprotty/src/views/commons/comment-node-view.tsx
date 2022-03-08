/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
/* eslint-disable react/jsx-key */
import { injectable } from "inversify";
import { VNode } from "snabbdom";
import {
    RectangularNodeView,
    PolylineEdgeView,
    SEdge,
    Point,
    RenderingContext,
    svg
} from "sprotty/lib";

import { LabeledNode } from "../../model";

/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class CommentNodeView extends RectangularNodeView {
    render(node: LabeledNode, context: RenderingContext): VNode {
        const w = Math.max(0, node.bounds.width);
        const h = Math.max(0, node.bounds.height);
        const commentNode: any = (<g class-node={true} class-selected={node.selected} class-mouseover={node.hoverFeedback}>
            <defs>
                <filter id="dropShadow">
                    <feDropShadow dx="1.5" dy="1.5" stdDeviation="0.5" style-flood-color="var(--uml-drop-shadow)" style-flood-opacity="0.5" />
                </filter>
            </defs>

            <path d={`M 0 0 H ${w - 16} L ${w} 16 V ${h} H 0 L 0 0`} />
            {context.renderChildren(node)}
        </g>);
        return commentNode;
    }
}

@injectable()
export class CommentLinkEdgeView extends PolylineEdgeView {
    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        return [];
    }

    protected renderLine(edge: SEdge, segments: Point[], context: RenderingContext): VNode {
        const firstPoint = segments[0];
        let path = `M ${firstPoint.x},${firstPoint.y}`;
        for (let i = 1; i < segments.length; i++) {
            const p = segments[i];
            path += ` L ${p.x},${p.y}`;
        }
        // TODO: stroke-dasharray="4"
        const commentLink: any = (<path class-stroked={true} d={path} />);
        return commentLink;
    }
}
