/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { GLSPProjectionView, type GViewportRootElement, type IViewArgs, type RenderingContext, svg } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { type VNode, type VNodeStyle, h } from 'snabbdom';
import { SVGIdCreatorService } from './services/svg-id-creator.service.js';

const MARKER_TRIANGLE_ID = 'marker-triangle';
const MARKER_TRIANGLE_EMPTY_ID = 'marker-triangle-empty';
const MARKER_TENT_ID = 'marker-tent';
const MARKER_DIAMOND_ID = 'marker-diamond';
const MARKER_DIAMONG_EMPTY_ID = 'marker-diamond-empty';
const FILTER_DROP_SHADOW_ID = 'filter-drop-shadow';

@injectable()
export class UMLGraphProjectionView extends GLSPProjectionView {
    @inject(SVGIdCreatorService)
    protected svgIdCreator: SVGIdCreatorService;

    protected override renderSvg(model: Readonly<GViewportRootElement>, context: RenderingContext, _args?: IViewArgs): VNode {
        const edgeRouting = this.edgeRouterRegistry.routeAllChildren(model);
        const transform = `scale(${model.zoom}) translate(${-model.scroll.x},${-model.scroll.y})`;
        const ns = 'http://www.w3.org/2000/svg';
        return h(
            'svg',
            { ns, style: this.renderStyle(context) },
            h('g', { ns, attrs: { transform }, class: { 'svg-defs': true } }, [
                ...this.renderAdditionals(context),
                ...context.renderChildren(model, { edgeRouting })
            ])
        );
    }

    protected renderAdditionals(_context: RenderingContext): VNode[] {
        const directedEdgeAdds: any = [
            <defs>
                <marker
                    id={this.svgIdCreator.createDefId(MARKER_TRIANGLE_ID)}
                    viewBox='0 0 10 10'
                    refX='10'
                    refY='5'
                    markerUnits='userSpaceOnUse'
                    markerWidth='20'
                    markerHeight='20'
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
                    markerWidth='20'
                    markerHeight='20'
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
                    markerWidth='20'
                    markerHeight='20'
                    orient='auto-start-reverse'
                >
                    <path d='M 0 0 L 10 5 L 0 10' stroke='var(--uml-edge)' fill='none' />
                </marker>
                <marker
                    id={this.svgIdCreator.createDefId(MARKER_DIAMOND_ID)}
                    viewBox='0 0 20 10'
                    refX='20'
                    refY='5'
                    markerUnits='userSpaceOnUse'
                    markerWidth='30'
                    markerHeight='20'
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
                    markerWidth='30'
                    markerHeight='20'
                    orient='auto-start-reverse'
                >
                    <path d='M 0 5 L 10 10 L 20 5 L 10 0 L 0 5 z' stroke='var(--uml-edge)' fill='var(--uml-editor-background)' />
                </marker>
                <filter id={this.svgIdCreator.createDefId(FILTER_DROP_SHADOW_ID)}>
                    <feDropShadow dx='3' dy='5' stdDeviation='3' style-flood-color='var(--uml-drop-shadow)' style-flood-opacity='1' />
                </filter>
            </defs>
        ];

        return directedEdgeAdds;
    }

    protected renderStyle(_context: RenderingContext): VNodeStyle {
        return {
            height: '100%',
            '--svg-def-marker-triangle': `url(#${this.svgIdCreator.createDefId(MARKER_TRIANGLE_ID)})`,
            '--svg-def-marker-triangle-empty': `url(#${this.svgIdCreator.createDefId(MARKER_TRIANGLE_EMPTY_ID)})`,
            '--svg-def-marker-tent': `url(#${this.svgIdCreator.createDefId(MARKER_TENT_ID)})`,
            '--svg-def-marker-diamond': `url(#${this.svgIdCreator.createDefId(MARKER_DIAMOND_ID)})`,
            '--svg-def-marker-diamond-empty': `url(#${this.svgIdCreator.createDefId(MARKER_DIAMONG_EMPTY_ID)})`,
            '--svg-def-filter-drop-shadow': `url(#${this.svgIdCreator.createDefId(FILTER_DROP_SHADOW_ID)})`
        };
    }
}
