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
import { Connectable, Point, PolylineEdgeView, RenderingContext, SEdge, Selectable, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class DirectedEdgeView extends PolylineEdgeView {
    protected override renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        const directedEdgeAdds: any = [
            <defs>
                <marker
                    marker-id='triangle'
                    viewBox='0 0 10 10'
                    refX='10'
                    refY='5'
                    markerUnits='strokeWidth'
                    markerWidth='10'
                    markerHeight='10'
                    orient='auto'
                >
                    <path d='M 0 0 L 10 5 L 0 10 z' fill='var(--uml-edge)' />
                </marker>
                <marker
                    marker-id='tent'
                    viewBox='0 0 10 10'
                    refX='10'
                    refY='5'
                    markerUnits='strokeWidth'
                    markerWidth='10'
                    markerHeight='10'
                    orient='auto'
                >
                    <path d='M 0 0 L 10 5 L 0 10' stroke='var(--uml-edge)' fill='var(--theia-editor-background)' />
                </marker>
                <marker
                    marker-id='triangle-empty'
                    viewBox='0 0 20 20'
                    refX='20'
                    refY='10'
                    markerUnits='strokeWidth'
                    markerWidth='20'
                    markerHeight='20'
                    orient='auto'
                >
                    <path d='M 0 0 L 100 100 L 40 20 z' stroke='var(--uml-edge)' fill='var(--theia-editor-background)' />
                </marker>
                <marker
                    marker-id='diamond'
                    viewBox='20 20 20 20'
                    refX='20'
                    refY='10'
                    markerUnits='strokeWidth'
                    markerWidth='20'
                    markerHeight='20'
                    orient='auto'
                >
                    <path d='M 0 0 L 10 5 L 0 10' stroke='var(--uml-edge)' fill='var(--theia-editor-background)' />
                </marker>
                <marker
                    marker-id='diamond-empty'
                    viewBox='20 10 20 10'
                    refX='20'
                    refY='10'
                    markerUnits='strokeWidth'
                    markerWidth='10'
                    markerHeight='20'
                    orient='auto'
                >
                    <path d='M 0 0 L 10 5 L 0 10' stroke='var(--uml-edge)' fill='var(--theia-editor-background)' />
                </marker>
            </defs>
        ];
        return directedEdgeAdds;
    }

    protected override renderLine(edge: SEdge, segments: Point[], context: RenderingContext): VNode {
        const firstPoint = segments[0];
        let path = `M ${firstPoint.x},${firstPoint.y}`;
        for (let i = 1; i < segments.length; i++) {
            const p = segments[i];
            path += ` L ${p.x},${p.y}`;
        }
        const renderLine: any = <path d={path} />;
        return renderLine;
    }

    override render(edge: Readonly<SEdge & Connectable & Selectable>, context: RenderingContext): VNode | undefined {
        const router = this.edgeRouterRegistry.get(edge.routerKind);
        const route = router.route(edge);

        if (route.length === 0) {
            return this.renderDanglingEdge('Cannot compute route', edge, context);
        }
        if (!this.isVisible(edge, route, context)) {
            if (edge.children.length === 0) {
                return undefined;
            }
            // The children of an edge are not necessarily inside the bounding box of the route,
            // so we need to render a group to ensure the children have a chance to be rendered.
            const edgeChildren: any = <g>{context.renderChildren(edge, { route })}</g>;
            return edgeChildren;
        }

        const directedEdge: any = (
            <g class-sprotty-edge={true} class-mouseover={edge.hoverFeedback}>
                {this.renderAdditionals(edge, route, context)}
                {this.renderLine(edge, route, context)}
                {context.renderChildren(edge, { route })}
            </g>
        );
        return directedEdge;
    }
}
