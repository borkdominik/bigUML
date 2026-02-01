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
    type Args,
    type ArgsAware,
    boundsFeature,
    type Deletable,
    deletableFeature,
    fadeFeature,
    GCompartment,
    GShapeElement,
    type Hoverable,
    hoverFeedbackFeature,
    type IView,
    layoutableChildFeature,
    layoutContainerFeature,
    type RenderingContext,
    type Selectable,
    selectFeature,
    svg
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';

export class GIcon extends GShapeElement {
    iconImageName: string;

    override hasFeature(feature: symbol): boolean {
        return (
            feature === boundsFeature || feature === layoutContainerFeature || feature === layoutableChildFeature || feature === fadeFeature
        );
    }
}

export class GIconCSS extends GIcon implements ArgsAware {
    args: Args;
}

export class GIconLabelCompartment extends GCompartment implements Selectable, Deletable, Hoverable {
    selected = false;
    hoverFeedback = false;

    override hasFeature(feature: symbol): boolean {
        return super.hasFeature(feature) || feature === selectFeature || feature === deletableFeature || feature === hoverFeedbackFeature;
    }
}

@injectable()
export class GIconView implements IView {
    render(element: GIcon, context: RenderingContext): VNode {
        let image;
        if (element.iconImageName) {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            image = require('../../resources/images/' + element.iconImageName);
        }

        const iconView: any = (
            <g>
                <image class-sprotty-icon={true} href={image} x={-2} y={-1} width={20} height={20}></image>
                {context.renderChildren(element)}
            </g>
        );
        return iconView;
    }
}

@injectable()
export class GIconCSSView implements IView {
    render(element: GIconCSS, context: RenderingContext): VNode {
        let image;

        const propertyArg = element.args['property'];
        if (propertyArg !== undefined) {
            const property = window.getComputedStyle(document.body).getPropertyValue(propertyArg.toLocaleString());
            const url = property.match(/url\(([^)]+)\)/i)![1].replace(/\\/g, '');
            image = url;
        }

        const iconView: any = (
            <g>
                <image class-sprotty-icon={true} href={image} x={-2} y={-1} width={20} height={20}></image>
                {context.renderChildren(element)}
            </g>
        );
        return iconView;
    }
}
