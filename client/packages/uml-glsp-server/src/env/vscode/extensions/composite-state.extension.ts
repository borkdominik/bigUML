/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isRegion, isState, type State } from '@borkdominik-biguml/uml-model-server/grammar';
import type * as jsonpatch from 'fast-json-patch';
import { inject, injectable } from 'inversify';
import { ModelPatchBuilder } from '../features/mutation/model-patch.js';
import type { BoundsChange, MutationExtension, NodeCreated } from '../features/mutation/extension/mutation-extension.js';
import { DiagramModelState } from '../features/model/diagram-model-state.js';
import { regionHeightWithin, stateSizeForBands, stateSizeWithRegions } from '../geometry/composite-state.js';

/**
 * What a composite state does differently from every other node.
 *
 * A state is drawn as a box holding its name, and it stores that size from the moment it is created.
 * A state with a region in it is not that box any more: it is the frame its substates stand inside,
 * divided into one band per region. Three things follow, and they are all here:
 *
 * - Given its first region, the state opens into a frame wide enough to put substates in.
 * - A band is not sized on its own. Its depth is its share of the state's height, so dragging a band
 *   resizes the state and stores the depth on it as `regionHeight` - never `bounds` for the region.
 * - Dragging the state stretches its bands rather than leaving a gap under the last one, so the
 *   state's new height is written back as the depth each band is drawn at.
 */
@injectable()
export class CompositeStateExtension implements MutationExtension {
    @inject(DiagramModelState)
    protected readonly modelState: DiagramModelState;

    @inject(ModelPatchBuilder)
    protected readonly patches: ModelPatchBuilder;

    /**
     * Opens the state into a frame when a region is put *into* it. Only then: the same drop carrying a
     * location makes a region of the diagram drawn on top of the state instead, which is not a band
     * of it and must not resize it - which is why the container path is asked rather than the drop.
     */
    afterNodeCreated({ operation, containerPath }: NodeCreated): jsonpatch.Operation[] {
        if (!operation.containerId) {
            return [];
        }
        const state = this.modelState.index.findIdElement(operation.containerId);
        const statePath = state && this.modelState.index.findPath(state.__id);
        if (!isState(state) || !statePath || containerPath !== `${statePath}/regions/-`) {
            return [];
        }

        // The region this operation adds is not on the state yet, so it is counted in here.
        const size = stateSizeWithRegions(this.modelState.index.findSize(state.__id), state, (state.regions?.length ?? 0) + 1);
        return this.patches.size(state.__id, size);
    }

    /**
     * A drag on a band of a composite state. Claimed whether or not anything is written: a band is
     * placed by the state that owns it, so there are never `bounds` of its own to store.
     */
    claimBoundsChange(change: BoundsChange): jsonpatch.Operation[] | undefined {
        const region = change.element;
        if (!isRegion(region) || !isState(region.$container)) {
            return undefined;
        }
        // A move reports the size the band is currently rendered at rather than one anybody asked for,
        // so only a resize sets the depth.
        if (change.moved || !change.newSize?.height) {
            return [];
        }

        const state = region.$container;
        const bandHeight = Math.round(change.newSize.height);
        // Both the depth and the box, not just the depth: a band is drawn at its share of the state it
        // divides, so a depth written without the box to go with it is a number the next layout pass
        // draws straight over.
        return [
            ...this.regionHeightPatch(state, bandHeight),
            ...this.patches.size(state.__id, stateSizeForBands(this.modelState.index.findSize(state.__id), state, bandHeight))
        ];
    }

    /** Dragging a state that holds regions stretches the bands it is made of: the bands are the box. */
    afterBoundsChange(change: BoundsChange): jsonpatch.Operation[] {
        const state = change.element;
        if (!isState(state) || (state.regions?.length ?? 0) === 0 || change.moved || !change.newSize?.height) {
            return [];
        }
        const stored = this.modelState.index.findSize(state.__id);
        if (change.newSize.height === stored?.height) {
            return [];
        }
        return this.regionHeightPatch(state, regionHeightWithin(change.newSize.height, state));
    }

    /**
     * Stored as an integer because that is what the grammar holds, and written with `add` where the
     * state carries no such number yet - every state written before this existed has none.
     */
    protected regionHeightPatch(state: State, height: number): jsonpatch.Operation[] {
        const statePath = this.modelState.index.findPath(state.__id);
        if (!statePath || height === state.regionHeight) {
            return [];
        }
        return [{ op: state.regionHeight === undefined ? 'add' : 'replace', path: `${statePath}/regionHeight`, value: height }];
    }
}
