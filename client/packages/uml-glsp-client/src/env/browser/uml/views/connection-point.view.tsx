/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { GPort, type RenderingContext, ShapeView, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { UML_CENTER_ANCHOR_KIND } from '../../features/routing/uml-center-anchor.js';

/**
 * One of the named points an edge can be pinned to - a tip of a choice diamond.
 *
 * The port is deliberately larger than what it draws. A tip is a point, and a point cannot be clicked;
 * the bounds are the hit area that makes it clickable, while the dot marks where the tip actually is.
 * That is also why the edge anchors to the middle rather than the outline - see `UmlCenterAnchor`.
 */
export class GConnectionPointPort extends GPort {
    override get anchorKind(): string {
        return UML_CENTER_ANCHOR_KIND;
    }
}

/** Radius of the dot. Small, because it marks a point rather than being a shape of its own. */
const DOT_RADIUS = 3.5;

@injectable()
export class GConnectionPointPortView extends ShapeView {
    override render(port: Readonly<GConnectionPointPort>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(port, context)) {
            return undefined;
        }

        // Drawn at the centre of the hit area, which is where the port was placed on the tip.
        return (
            <g class-uml-connection-point={true} class-mouseover={port.hoverFeedback} class-selected={port.selected}>
                <circle cx={port.bounds.width / 2} cy={port.bounds.height / 2} r={DOT_RADIUS} />
            </g>
        ) as any;
    }
}
