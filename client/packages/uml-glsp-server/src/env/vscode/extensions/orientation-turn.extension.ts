/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { Dimension } from '@eclipse-glsp/protocol';
import type * as jsonpatch from 'fast-json-patch';
import { inject, injectable } from 'inversify';
import { ModelPatchBuilder } from '../features/mutation/model-patch.js';
import type { MutationExtension, PropertyUpdate } from '../features/mutation/extension/mutation-extension.js';
import { DiagramModelState } from '../features/model/diagram-model-state.js';
import { ORIENTATION_PROPERTY_ID, storedOrientationDefaultSize, turnableDefaultSize } from '../geometry/orientation.js';
import { hasUsableSize } from '../geometry/node-size.js';

/**
 * Turning a shape from the property palette.
 *
 * The palette offers `orientation` for the bars and the diamonds without any property to back it:
 * which way a bar runs *is* its shape, so turning one is a swap of its stored width and height. A
 * swimlane does store its orientation, and is turned by writing that property *and* swapping its
 * bounds, so the shape ends up lying the way its lanes now run.
 */
@injectable()
export class OrientationTurnExtension implements MutationExtension {
    @inject(DiagramModelState)
    protected readonly modelState: DiagramModelState;

    @inject(ModelPatchBuilder)
    protected readonly patches: ModelPatchBuilder;

    updateProperty({ operation, element, writeProperty }: PropertyUpdate): jsonpatch.Operation[] | undefined {
        if (operation.property !== ORIENTATION_PROPERTY_ID) {
            return undefined;
        }

        const turnable = turnableDefaultSize(element);
        if (turnable) {
            return this.turn(operation.elementId, turnable, operation.value === 'VERTICAL');
        }

        const stored = storedOrientationDefaultSize(element);
        if (stored) {
            // The property first, because the swap is what a reader of the patch would otherwise take
            // for the whole of the change.
            const written = writeProperty();
            return [...(written ? [written] : []), ...this.turn(operation.elementId, stored, operation.value === 'VERTICAL')];
        }

        return undefined;
    }

    /**
     * Swaps the shape's stored width and height. A shape that has never been given a size is written
     * one, since there is nothing stored yet to turn.
     */
    protected turn(elementId: string, defaultSize: Dimension, wantVertical: boolean): jsonpatch.Operation[] {
        const stored = this.modelState.index.findSize(elementId);
        const size = hasUsableSize(stored) ? { width: stored.width, height: stored.height } : defaultSize;

        // A square has no long axis to turn, and a shape already lying the way it was asked to lie has
        // nothing to do either. Both would otherwise write the size back unchanged, which still costs
        // the user an undo step and a redraw.
        if (size.width === size.height || size.height > size.width === wantVertical) {
            return [];
        }

        return this.patches.size(elementId, { width: size.height, height: size.width });
    }
}
