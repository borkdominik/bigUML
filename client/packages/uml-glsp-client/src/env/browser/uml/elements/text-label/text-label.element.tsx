/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { NamedElement, NamedElementView } from '../named-element/index.js';

export class GTextLabelNode extends NamedElement {}

/**
 * A label: writing on the diagram with nothing drawn around it.
 *
 * Nothing is not the same as nowhere, which is what this view is for. The label still has bounds - they
 * are what its writing wraps to, what a resize handle takes hold of, and what a click has to land on -
 * and an unpainted shape takes no pointer events at all, so a label with no background could only be
 * selected by hitting a letter of it. So the bounds are painted in `transparent`, which is picked up by
 * the pointer and shows nothing (see `uml-hit-area`).
 *
 * The one thing drawn is an outline, and only while the pointer is over the label or the label is
 * selected. Without it there is no telling a label apart from writing that happens to be there, nor
 * seeing how far it reaches when the time comes to drag its edge - and with it always on, a label would
 * simply be a note again.
 */
@injectable()
export class GTextLabelNodeView extends NamedElementView {
    protected override renderBackground(element: NamedElement): VNode {
        const width = Math.max(0, element.bounds.width);
        const height = Math.max(0, element.bounds.height);

        return (
            <g>
                {/* No slack around it, unlike the shapes `hitAreaBox` is for: a label's own padding
                    already stands between its writing and its edge, and slack on top of that would take
                    clicks away from whatever the label was placed beside. */}
                <rect class-uml-hit-area={true} x={0} y={0} width={width} height={height} />
                <rect class-uml-text-label-outline={true} x={0} y={0} width={width} height={height} />
            </g>
        ) as any;
    }
}
