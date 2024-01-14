/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    boundsFeature,
    fadeFeature, GShapeElement, IView,
    layoutableChildFeature,
    RenderingContext, svg
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
// eslint-disable-next-line no-restricted-imports
import { alignFeature } from 'sprotty';

export class SDivider extends GShapeElement {
    static readonly DEFAULT_FEATURES = [boundsFeature, layoutableChildFeature, fadeFeature, alignFeature];
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class SDividerView implements IView {
    render(element: SDivider, context: RenderingContext): VNode {
        const view: any = (
            <g>
                <path class-uml-comp-separator d={`M 0,0  L ${element.bounds.width},0`}></path>
                {context.renderChildren(element)}
            </g>
        );
        return view;
    }
}
