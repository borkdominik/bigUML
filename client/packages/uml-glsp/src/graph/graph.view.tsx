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
import { inject, injectable } from 'inversify';
import { VNode, VNodeStyle } from 'snabbdom';
import { SVGIdCreatorService } from './svg-id-creator.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

const MARKER_TRIANGLE_ID = 'marker-triangle';
const MARKER_TRIANGLE_EMPTY_ID = 'marker-triangle-empty';
const MARKER_TENT_ID = 'marker-tent';
const MARKER_DIAMOND_ID = 'marker-diamond';
const MARKER_DIAMONG_EMPTY_ID = 'marker-diamond-empty';
const FILTER_DROP_SHADOW_ID = 'filter-drop-shadow';

@injectable()
export class UmlGraphView<IRenderingArgs> extends SGraphView {
    @inject(SVGIdCreatorService)
    protected svgIdCreator: SVGIdCreatorService;

    override render(model: Readonly<SGraph>, context: RenderingContext, args?: IRenderingArgs): VNode {
        const edgeRouting = this.edgeRouterRegistry.routeAllChildren(model);
        const transform = `scale(${model.zoom}) translate(${-model.scroll.x},${-model.scroll.y})`;
        return (
            <svg class-sprotty-graph={true} style={this.renderStyle(context)}>
                <g transform={transform} class-svg-defs>
                    {this.renderAdditionals(context)}
                    {context.renderChildren(model, { edgeRouting })}
                </g>
            </svg>
        ) as any;
    }

    protected renderAdditionals(context: RenderingContext): VNode[] {
        const directedEdgeAdds: any = [
            <defs>
                <marker
                    id={this.svgIdCreator.createDefId(MARKER_TRIANGLE_ID)}
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
                    id={this.svgIdCreator.createDefId(MARKER_TRIANGLE_EMPTY_ID)}
                    viewBox='0 0 10 10'
                    refX='10'
                    refY='5'
                    markerUnits='userSpaceOnUse'
                    markerWidth='10'
                    markerHeight='10'
                    orient='auto-start-reverse'
                >
                    <path d='M 0 0 L 10 5 L 0 10 L 0 0 z' stroke='var(--uml-edge)' fill='var(--uml-editor-background)' />
                </marker>
                <marker
                    id={this.svgIdCreator.createDefId(MARKER_TENT_ID)}
                    viewBox='0 0 10 10'
                    refX='10'
                    refY='5'
                    markerUnits='userSpaceOnUse'
                    markerWidth='10'
                    markerHeight='10'
                    orient='auto-start-reverse'
                >
                    <path d='M 0 0 L 10 5 L 0 10' stroke='var(--uml-edge)' fill='var(--uml-editor-background)' />
                </marker>
                <marker
                    id={this.svgIdCreator.createDefId(MARKER_DIAMOND_ID)}
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
                    id={this.svgIdCreator.createDefId(MARKER_DIAMONG_EMPTY_ID)}
                    viewBox='0 0 20 10'
                    refX='20'
                    refY='5'
                    markerUnits='userSpaceOnUse'
                    markerWidth='20'
                    markerHeight='10'
                    orient='auto-start-reverse'
                >
                    <path d='M 0 5 L 10 10 L 20 5 L 10 0 L 0 5 z' stroke='var(--uml-edge)' fill='var(--uml-editor-background)' />
                </marker>
                <filter id={this.svgIdCreator.createDefId(FILTER_DROP_SHADOW_ID)}>
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

    protected renderStyle(context: RenderingContext): VNodeStyle {
        return {
            '--svg-def-marker-triangle': `url(#${this.svgIdCreator.createDefId(MARKER_TRIANGLE_ID)})`,
            '--svg-def-marker-empty': `url(#${this.svgIdCreator.createDefId(MARKER_TRIANGLE_EMPTY_ID)})`,
            '--svg-def-marker-tent': `url(#${this.svgIdCreator.createDefId(MARKER_TENT_ID)})`,
            '--svg-def-marker-diamond': `url(#${this.svgIdCreator.createDefId(MARKER_DIAMOND_ID)})`,
            '--svg-def-marker-diamond-empty': `url(#${this.svgIdCreator.createDefId(MARKER_DIAMONG_EMPTY_ID)})`,
            '--svg-def-filter-drop-shadow': `url(#${this.svgIdCreator.createDefId(FILTER_DROP_SHADOW_ID)})`
        };
    }
}
