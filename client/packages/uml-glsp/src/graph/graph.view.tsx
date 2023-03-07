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
import { RenderingContext, SGraph, SGraphView, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class UmlGraphView<IRenderingArgs> extends SGraphView {
    protected renderAdditionals(context: RenderingContext): VNode[] {
        const directedEdgeAdds: any = [
            <defs>
                <marker
                    id='marker-triangle'
                    viewBox='0 0 10 10'
                    refX='10'
                    refY='5'
                    markerUnits='userSpaceOnUse'
                    markerWidth='10'
                    markerHeight='10'
                    orient='auto-start-reverse'
                >
                    <path d='M 0 0 L 10 5 L 0 10 L 0 0 z' fill='var(--uml-edge)' />
                </marker>
                <marker
                    id='marker-triangle-empty'
                    viewBox='0 0 10 10'
                    refX='10'
                    refY='5'
                    markerUnits='userSpaceOnUse'
                    markerWidth='10'
                    markerHeight='10'
                    orient='auto-start-reverse'
                >
                    <path d='M 0 0 L 10 5 L 0 10 L 0 0 z' stroke='var(--uml-edge)' fill='var(--theia-editor-background)' />
                </marker>
                <marker
                    id='marker-tent'
                    viewBox='0 0 10 10'
                    refX='10'
                    refY='5'
                    markerUnits='userSpaceOnUse'
                    markerWidth='10'
                    markerHeight='10'
                    orient='auto-start-reverse'
                >
                    <path d='M 0 0 L 10 5 L 0 10' stroke='var(--uml-edge)' fill='var(--theia-editor-background)' />
                </marker>
                <marker
                    id='marker-diamond'
                    viewBox='0 0 20 10'
                    refX='20'
                    refY='5'
                    markerUnits='userSpaceOnUse'
                    markerWidth='20'
                    markerHeight='10'
                    orient='auto-start-reverse'
                >
                    <path d='M 0 5 L 10 10 L 20 5 L 10 0 L 0 5 z' fill='var(--uml-edge)' />
                </marker>
                <marker
                    id='marker-diamond-empty'
                    viewBox='0 0 20 10'
                    refX='20'
                    refY='5'
                    markerUnits='userSpaceOnUse'
                    markerWidth='20'
                    markerHeight='10'
                    orient='auto-start-reverse'
                >
                    <path d='M 0 5 L 10 10 L 20 5 L 10 0 L 0 5 z' stroke='var(--uml-edge)' fill='var(--theia-editor-background)' />
                </marker>
                <filter id='filter-drop-shadow'>
                    <feDropShadow
                        dx='1.5'
                        dy='1.5'
                        stdDeviation='0.5'
                        style-flood-color='var(--uml-drop-shadow)'
                        style-flood-opacity='0.5'
                    />
                </filter>
            </defs>
        ];

        return directedEdgeAdds;
    }

    override render(model: Readonly<SGraph>, context: RenderingContext, args?: IRenderingArgs): VNode {
        const edgeRouting = this.edgeRouterRegistry.routeAllChildren(model);
        const transform = `scale(${model.zoom}) translate(${-model.scroll.x},${-model.scroll.y})`;
        return (
            <svg class-sprotty-graph={true}>
                <g transform={transform}>
                    {this.renderAdditionals(context)}
                    {context.renderChildren(model, { edgeRouting })}
                </g>
            </svg>
        ) as any;
    }
}
