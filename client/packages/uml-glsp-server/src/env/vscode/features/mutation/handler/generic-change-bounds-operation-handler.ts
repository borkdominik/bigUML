/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    isInteraction,
    isLifeline,
    isRegion,
    isState,
    isStateMachine,
    isStateMachineDiagramNodes,
    isSubject,
    isUseCase
} from '@borkdominik-biguml/uml-model-server/grammar';
import { isNoBounds } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { ChangeBoundsOperation, type Command, OperationHandler } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { URI } from 'vscode-uri';
import { regionHeightWithin, stateSizeForBands } from '../../../elements/state.element.js';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';

type BoundsPatch = { op: 'add'; path: string; value: unknown } | { op: 'replace'; path: string; value: unknown };

/**
 * The entity types a moved container drags along, or `undefined` if the element is not such a container.
 * A state machine frame contains every node of its own diagram - including nested frames, whose contents
 * are covered as well since they also lie within the outer frame's bounds.
 */
function containedTypePredicate(container: unknown): ((entity: unknown) => boolean) | undefined {
    if (isSubject(container)) {
        return isUseCase;
    }
    if (isStateMachine(container)) {
        return isStateMachineDiagramNodes;
    }
    if (isInteraction(container)) {
        return isLifeline;
    }
    return undefined;
}

@injectable()
export class GenericChangeBoundsOperationHandler extends OperationHandler {
    readonly operationType = ChangeBoundsOperation.KIND;

    declare readonly modelState: DiagramModelState;

    override createCommand(operation: ChangeBoundsOperation): Command | undefined {
        const patch = this.changeBounds(operation);

        // Nothing to write, because every element the operation carried stores no bounds of its own -
        // dragging a pin is the whole of such an operation. An empty patch is not the harmless no-op it
        // looks like: `PatchManager` applies the operations one by one and then reads the result of the
        // last one, so with none to apply it reads `newDocument` off nothing and the edit fails outright.
        if (patch.length === 0) {
            return undefined;
        }

        return new ModelPatchCommand(this.modelState, JSON.stringify(patch));
    }

    protected changeBounds(operation: ChangeBoundsOperation): BoundsPatch[] {
        const patch: BoundsPatch[] = [];

        const defaultDocPath = URI.parse(this.modelState.semanticUri).path;

        // Elements that are themselves genuinely repositioned by this same operation (not just
        // listed with an unchanged position, which can happen for incidentally-selected elements)
        // must not also be shifted by the cascade below, or they would be moved twice.
        const nonZeroMovedElementIds = new Set(
            operation.newBounds
                .filter(({ elementId, newPosition }) => {
                    if (!newPosition) {
                        return false;
                    }
                    const position = this.modelState.index.findPosition(elementId);
                    return !position || newPosition.x !== position.x || newPosition.y !== position.y;
                })
                .map(b => b.elementId)
        );

        operation.newBounds.forEach(({ elementId, newSize, newPosition }) => {
            // An element declared `noBounds` is placed by whatever owns it - a pin by its action, a
            // property by its class - so there is nothing of its own to store. Writing bounds anyway is
            // what leaves a `Size` at the diagram root naming an element nested inside another one, which
            // nothing at that level can reach: the reference goes out as the word `undefined` and the
            // file stops parsing. `GenericCreateNodeOperationHandler` skips these for the same reason.
            if (this.hasNoBounds(elementId)) {
                return;
            }

            // And neither is there anywhere to store bounds for something that is not an element at all.
            // A compartment can be resized - a region's band is (see `GStateRegionCompartment`) - and one
            // that carries an element's id has that element to record it against, while one that does not
            // would be named by a `Size` reference pointing at nothing: the reference goes out as the word
            // `undefined` and the file stops parsing. The compartment holding a state's parts is the case
            // in point, whose height is kept on the state itself as `partsHeight`.
            if (!this.modelState.index.findIdElement(elementId)) {
                return;
            }

            // Whether this operation moved the element or resized it where it stood.
            //
            // The two have to be told apart before anything is read out of `newSize`, because a move
            // reports the size the element is *currently rendered at* rather than one anybody asked for
            // (see `toElementAndBounds`) - and that is not the stored one: the client grows a box to fit
            // what is in it, so a state carrying a name and a part or two renders taller than the height
            // the server gave it. Taking a band's depth from that on a move made the depth bigger, which
            // made the box bigger, which made the next move bigger again - the bottom band grew a little
            // every time the state was dragged anywhere.
            const moved = nonZeroMovedElementIds.has(elementId);

            // A band of a composite state is not placed on the canvas and is not sized on its own: its
            // width is the room inside the state's borders and its depth is its share of the state's
            // height. A drag on one therefore resizes that state, and stores nothing against the region
            // itself - a `Size` written for a region would be a dimension nothing ever reads again.
            if (this.setsRegionHeight(elementId)) {
                if (!moved && newSize?.height) {
                    this.patchRegionHeight(elementId, newSize.height, defaultDocPath, patch);
                }
                return;
            }

            const size = this.modelState.index.findSize(elementId);

            // An operation that carries no new size (a pure move) must keep the stored one: writing
            // `undefined` back would leave a Size metaInfo without usable dimensions behind, which
            // silently collapses every node whose layout is driven by its persisted size.
            this.pushSize(
                elementId,
                { width: newSize?.width ?? size?.width, height: newSize?.height ?? size?.height },
                defaultDocPath,
                patch
            );

            const positionPath = this.modelState.index.findPositionPath(elementId);
            const position = (this.modelState.index as any).findPosition
                ? (this.modelState.index as any).findPosition(elementId)
                : undefined;

            patch.push({
                op: positionPath && position ? 'replace' : 'add',
                path: positionPath ?? '/metaInfos/-',
                value: {
                    $type: 'Position',
                    __id: `pos_${elementId}`,
                    element: {
                        $ref: {
                            __id: elementId,
                            __documentUri: position?.element?.$nodeDescription?.documentUri.path ?? defaultDocPath
                        }
                    },
                    x: newPosition?.x ?? position?.x,
                    y: newPosition?.y ?? position?.y
                }
            });

            // Dragging a state that holds regions stretches the bands it is made of rather than leaving
            // them where they were: the bands are the box. Written back as the state's own
            // `regionHeight`, which is the one number all of them are drawn at - and only for a resize,
            // for the reason given above.
            if (!moved && newSize?.height && newSize.height !== size?.height) {
                this.stretchRegions(elementId, newSize.height, patch);
            }

            // Only a genuine move - the container keeping its current size - should drag its contents
            // along. A resize (even one that also shifts the anchor corner's position, e.g. dragging
            // the top-left handle) must not translate the contents, since the box didn't uniformly
            // translate: it stretched.
            const isResize = newSize && size && (newSize.width !== size.width || newSize.height !== size.height);
            if (newPosition && position && !isResize) {
                const dx = newPosition.x - position.x;
                const dy = newPosition.y - position.y;
                if (dx !== 0 || dy !== 0) {
                    this.cascadeToContainedNodes(elementId, position, size, dx, dy, nonZeroMovedElementIds, defaultDocPath, patch);
                }
            }
        });

        return patch;
    }

    /** Whether this element is a band of a composite state, whose drag sets the state's region height. */
    protected setsRegionHeight(elementId: string): boolean {
        const element = this.modelState.index.findIdElement(elementId);
        return isRegion(element) && isState(element.$container);
    }

    /**
     * Writes the depth a band was dragged to onto the state that owns it - for all of its regions, since
     * they share one - and resizes the state to the box that many bands of that depth make up.
     *
     * Both, and not just the depth: a band is not drawn at a height of its own but at its share of the
     * state it divides (see `MIN_REGION_BAND_HEIGHT`), so a depth written without the box to go with it
     * is a number the next layout pass draws straight over. Dragging a band shallower did nothing at all
     * until the state came down with it.
     */
    protected patchRegionHeight(elementId: string, height: number, defaultDocPath: string, patch: BoundsPatch[]): void {
        const region = this.modelState.index.findIdElement(elementId);
        if (!isRegion(region) || !isState(region.$container)) {
            return;
        }
        const state = region.$container;
        const bandHeight = Math.round(height);
        this.pushRegionHeight(state, bandHeight, patch);
        this.pushSize(state.__id, stateSizeForBands(this.modelState.index.findSize(state.__id), state, bandHeight), defaultDocPath, patch);
    }

    /**
     * The one `Size` this operation writes for an element.
     *
     * Once and once only. A second `add` leaves two `Size` metaInfos naming the same element behind and
     * everything afterwards reads whichever of them was written first - so a band drag that sizes the
     * state it divides must not size it again when the state is in the same operation on its own account.
     */
    protected pushSize(elementId: string, size: { width?: number; height?: number }, defaultDocPath: string, patch: BoundsPatch[]): void {
        const sizeId = `size_${elementId}`;
        if (patch.some(entry => (entry.value as { __id?: string } | undefined)?.__id === sizeId)) {
            return;
        }

        const sizePath = this.modelState.index.findSizePath(elementId);
        const stored = this.modelState.index.findSize(elementId);

        patch.push({
            op: sizePath && stored ? 'replace' : 'add',
            path: sizePath ?? '/metaInfos/-',
            value: {
                $type: 'Size',
                __id: sizeId,
                element: {
                    $ref: {
                        __id: elementId,
                        __documentUri: stored?.element?.$nodeDescription?.documentUri.path ?? defaultDocPath
                    }
                },
                width: size.width,
                height: size.height
            }
        });
    }

    /** Turns a state's new height into the depth each of its bands is drawn at. */
    protected stretchRegions(elementId: string, stateHeight: number, patch: BoundsPatch[]): void {
        const state = this.modelState.index.findIdElement(elementId);
        if (!isState(state)) {
            return;
        }
        const regions = state.regions ?? [];
        if (regions.length === 0) {
            return;
        }
        this.pushRegionHeight(state, regionHeightWithin(stateHeight, state), patch);
    }

    /**
     * The one patch both of those come down to. Stored as an integer because that is what the grammar
     * holds, and written with `add` where the state carries no such number yet - `replace` on a property
     * that is not there is an error, and every state written before this one existed has none.
     */
    protected pushRegionHeight(state: { __id: string; regionHeight?: number }, height: number, patch: BoundsPatch[]): void {
        const statePath = this.modelState.index.findPath(state.__id);
        if (!statePath || height === state.regionHeight) {
            return;
        }
        patch.push({
            op: state.regionHeight === undefined ? 'add' : 'replace',
            path: `${statePath}/regionHeight`,
            value: height
        });
    }

    /** Whether the element is one that stores no bounds of its own, by the type it was drawn as. */
    protected hasNoBounds(elementId: string): boolean {
        const type = this.modelState.index.get(elementId)?.type;
        return !!type && isNoBounds(type);
    }

    /**
     * A container (a Subject, a StateMachine frame) and the nodes drawn inside it are flat,
     * independently positioned siblings in the gmodel (visual containment is purely absolute
     * (x,y)/size overlap, not real parent/child nesting - see `diagram-gmodel-factory.tsx`). Moving
     * the container therefore does not move the nodes drawn inside its boundary unless we explicitly
     * shift them here by the same delta. Only nodes whose center falls within the container's bounds
     * *before* the move are considered contained, and any node already being genuinely repositioned
     * by this same operation (e.g. multi-selected together with the container) is left alone since
     * its own explicit newPosition already applies - cascading on top of that would move it twice.
     * That guard is also what keeps the container itself out of its own cascade.
     */
    protected cascadeToContainedNodes(
        containerId: string,
        oldContainerPosition: { x: number; y: number },
        oldContainerSize: { width?: number; height?: number } | undefined,
        dx: number,
        dy: number,
        nonZeroMovedElementIds: Set<string>,
        defaultDocPath: string,
        patch: BoundsPatch[]
    ): void {
        const container = this.modelState.index.findIdElement(containerId);
        const isContained = containedTypePredicate(container);
        if (!isContained || !oldContainerSize?.width || !oldContainerSize?.height) {
            return;
        }

        const bounds = {
            left: oldContainerPosition.x,
            top: oldContainerPosition.y,
            right: oldContainerPosition.x + oldContainerSize.width,
            bottom: oldContainerPosition.y + oldContainerSize.height
        };

        for (const entity of this.modelState.semanticRoot.diagram.entities) {
            if (!isContained(entity) || nonZeroMovedElementIds.has(entity.__id)) {
                continue;
            }

            const entityPosition = this.modelState.index.findPosition(entity.__id);
            if (!entityPosition) {
                continue;
            }
            const entitySize = this.modelState.index.findSize(entity.__id);
            const centerX = entityPosition.x + (entitySize?.width ?? 0) / 2;
            const centerY = entityPosition.y + (entitySize?.height ?? 0) / 2;
            if (centerX < bounds.left || centerX > bounds.right || centerY < bounds.top || centerY > bounds.bottom) {
                continue;
            }

            const positionPath = this.modelState.index.findPositionPath(entity.__id);
            patch.push({
                op: positionPath ? 'replace' : 'add',
                path: positionPath ?? '/metaInfos/-',
                value: {
                    $type: 'Position',
                    __id: `pos_${entity.__id}`,
                    element: {
                        $ref: {
                            __id: entity.__id,
                            __documentUri: entityPosition.element?.$nodeDescription?.documentUri.path ?? defaultDocPath
                        }
                    },
                    x: entityPosition.x + dx,
                    y: entityPosition.y + dy
                }
            });
        }
    }
}
