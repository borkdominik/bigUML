/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { getElementMetadata } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { ChangeBoundsOperation, type Command, type ElementAndBounds, OperationHandler } from '@eclipse-glsp/server';
import type * as jsonpatch from 'fast-json-patch';
import { inject, injectable, multiInject, optional } from 'inversify';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';
import { type BoundsChange, firstClaim, MutationExtension } from '../extension/mutation-extension.js';
import { coalesceLayoutPatches, ModelPatchBuilder } from '../model-patch.js';

/**
 * Stores the new position and size of the elements a move or a resize was performed on.
 *
 * Generic in what it writes - the `bounds` of each element. What a container holds is drawn inside it and
 * placed relative to it, so it moves along without anything written for it here. What one element does
 * differently comes from the {@link MutationExtension}s:
 * a band of a composite state stores no bounds of its own, a state with regions stretches its bands.
 */
@injectable()
export class GenericChangeBoundsOperationHandler extends OperationHandler {
    readonly operationType = ChangeBoundsOperation.KIND;

    declare readonly modelState: DiagramModelState;

    @inject(ModelPatchBuilder)
    protected readonly patches: ModelPatchBuilder;

    @multiInject(MutationExtension)
    @optional()
    protected readonly extensions: MutationExtension[] = [];

    override createCommand(operation: ChangeBoundsOperation): Command | undefined {
        const patch = coalesceLayoutPatches(this.changeBounds(operation));

        // Nothing to write, because every element the operation carried stores no bounds of its own -
        // dragging a pin is the whole of such an operation. An empty patch is not the harmless no-op it
        // looks like: `PatchManager` reads the result off the last operation applied, so with none to
        // apply the edit fails outright.
        if (patch.length === 0) {
            return undefined;
        }

        return new ModelPatchCommand(this.modelState, JSON.stringify(patch));
    }

    protected changeBounds(operation: ChangeBoundsOperation): jsonpatch.Operation[] {
        const patch: jsonpatch.Operation[] = [];

        // Elements genuinely repositioned by this operation - not just listed with an unchanged position,
        // which happens for incidentally selected elements.
        const movedElementIds = new Set(operation.newBounds.filter(bounds => this.isMoved(bounds)).map(bounds => bounds.elementId));

        for (const { elementId, newSize, newPosition } of operation.newBounds) {
            // Bounds are stored against an element. A compartment can be resized too, but one that does
            // not carry an element's id has nothing to record it against - and an element placed by its
            // owner has nothing of its own to store either.
            const element = this.modelState.index.findIdElement(elementId);
            if (!element || getElementMetadata(element.$type)?.noBounds) {
                continue;
            }

            const stored = this.modelState.index.findSize(elementId);
            const change: BoundsChange = {
                elementId,
                element,
                newSize,
                newPosition,
                moved: movedElementIds.has(elementId),
                // Told apart from a move before anything is read out of `newSize`: a move reports the size
                // the element is *currently rendered at* rather than one anybody asked for, and the client
                // grows a box to fit what is in it.
                resized: !!newSize && !!stored && (newSize.width !== stored.width || newSize.height !== stored.height)
            };

            const claimed = firstClaim(this.extensions, extension => extension.claimBoundsChange?.(change));
            if (claimed) {
                patch.push(...claimed);
                continue;
            }

            // What the operation leaves out is kept as stored - a pure move keeps the stored size.
            patch.push(...this.patches.bounds(elementId, { ...newPosition, ...newSize }));
            patch.push(...this.extensions.flatMap(extension => extension.afterBoundsChange?.(change) ?? []));
        }

        return patch;
    }

    protected isMoved({ elementId, newPosition }: ElementAndBounds): boolean {
        if (!newPosition) {
            return false;
        }
        const position = this.modelState.index.findPosition(elementId);
        return !position || newPosition.x !== position.x || newPosition.y !== position.y;
    }
}
