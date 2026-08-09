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
    isStateMachine,
    isStateMachineDiagramNodes,
    isSubject,
    isUseCase
} from '@borkdominik-biguml/uml-model-server/grammar';
import { isNoBounds } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { ChangeBoundsOperation, type Command, OperationHandler } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { URI } from 'vscode-uri';
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

            const sizePath = this.modelState.index.findSizePath(elementId);
            const size = (this.modelState.index as any).findSize ? (this.modelState.index as any).findSize(elementId) : undefined;

            patch.push({
                op: sizePath && size ? 'replace' : 'add',
                path: sizePath ?? '/metaInfos/-',
                value: {
                    $type: 'Size',
                    __id: `size_${elementId}`,
                    element: {
                        $ref: {
                            __id: elementId,
                            __documentUri: size?.element?.$nodeDescription?.documentUri.path ?? defaultDocPath
                        }
                    },
                    // An operation that carries no new size (a pure move) must keep the stored one: writing
                    // `undefined` back would leave a Size metaInfo without usable dimensions behind, which
                    // silently collapses every node whose layout is driven by its persisted size.
                    width: newSize?.width ?? size?.width,
                    height: newSize?.height ?? size?.height
                }
            });

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
