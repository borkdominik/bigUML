/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { EdgeLayoutPostprocessor, type EdgePlacement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

/**
 * An edge placement that can stand a label further off the line without also moving it along the line.
 *
 * Sprotty uses a label's one `offset` both ways for a label turned along its edge: as the gap to the
 * line and as how far in from the end of the edge it starts. Stacking two labels at the same end - a role
 * name and the property string under it - needs the second one further from the line only; given the
 * larger `offset`, it was pushed along the edge by the same amount and no longer lined up.
 */
export interface UmlEdgePlacement extends EdgePlacement {
    /** How far from the line the label stands, where that differs from `offset` - which then only says how far in from the end. */
    perpendicularOffset?: number;
}

@injectable()
export class UmlEdgeLayoutPostprocessor extends EdgeLayoutPostprocessor {
    protected override getRotatedAlignment(
        element: Parameters<EdgeLayoutPostprocessor['getRotatedAlignment']>[0],
        placement: UmlEdgePlacement,
        flip: boolean
    ): ReturnType<EdgeLayoutPostprocessor['getRotatedAlignment']> {
        if (placement.perpendicularOffset === undefined) {
            return super.getRotatedAlignment(element, placement, flip);
        }
        // Along the edge the alignment depends on `offset` alone, and across it on `offset` alone too - so
        // each coordinate is taken from the one of the two offsets it is meant to follow.
        const along = super.getRotatedAlignment(element, placement, flip);
        const across = super.getRotatedAlignment(element, { ...placement, offset: placement.perpendicularOffset }, flip);
        return { x: along.x, y: across.y };
    }
}
