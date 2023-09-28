/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    Bounds,
    BoundsData,
    Dimension,
    isLayoutableChild,
    isLayoutContainer,
    LayoutContainer,
    Point,
    SChildElement,
    SParentElement,
    StatefulLayouter,
    VBoxLayouter,
    VBoxLayoutOptions
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class UmlVBoxLayouter extends VBoxLayouter {
    static override KIND = 'uml-vbox';

    protected override layoutChildren(
        container: SParentElement & LayoutContainer,
        layouter: StatefulLayouter,
        containerOptions: VBoxLayoutOptions,
        maxWidth: number,
        maxHeight: number
    ): Point {
        let currentOffset: Point = {
            x: containerOptions.paddingLeft + 0.5 * (maxWidth - maxWidth / containerOptions.paddingFactor),
            y: containerOptions.paddingTop + 0.5 * (maxHeight - maxHeight / containerOptions.paddingFactor)
        };
        container.children.forEach(child => {
            if (isLayoutableChild(child)) {
                const boundsData = layouter.getBoundsData(child);
                const bounds = boundsData.bounds;
                const childOptions = this.getChildLayoutOptions(child, containerOptions);
                console.log('BEFORE isLayoutableChild', child, isLayoutContainer(child), boundsData);

                if (bounds !== undefined && Dimension.isValid(bounds)) {
                    currentOffset = this.layoutChild(
                        child,
                        boundsData,
                        bounds,
                        childOptions,
                        containerOptions,
                        currentOffset,
                        maxWidth,
                        maxHeight
                    );
                    console.log('AFTER isLayoutableChild', child, layouter, boundsData);
                }
            }
        });
        return currentOffset;
    }

    protected override layoutChild(
        child: SChildElement,
        boundsData: BoundsData,
        bounds: Bounds,
        childOptions: VBoxLayoutOptions,
        containerOptions: VBoxLayoutOptions,
        currentOffset: Point,
        maxWidth: number,
        maxHeight: number
    ): { x: number; y: number } {
        return super.layoutChild(child, boundsData, bounds, childOptions, containerOptions, currentOffset, maxWidth, maxHeight);
    }
}
