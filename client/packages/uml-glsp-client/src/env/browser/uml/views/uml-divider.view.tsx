/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import {
    boundsFeature,
    fadeFeature,
    GShapeElement,
    type IView,
    layoutableChildFeature,
    type RenderingContext,
    svg
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
// eslint-disable-next-line no-restricted-imports
import { alignFeature } from 'sprotty';

export class GDivider extends GShapeElement {
    static readonly DEFAULT_FEATURES = [boundsFeature, layoutableChildFeature, fadeFeature, alignFeature];
}

@injectable()
export class GDividerView implements IView {
    render(element: GDivider, context: RenderingContext): VNode {
        const view: any = (
            <g>
                <path class-uml-comp-separator d={`M 0,0  L ${element.bounds.width},0`}></path>
                {context.renderChildren(element)}
            </g>
        );
        return view;
    }
}
