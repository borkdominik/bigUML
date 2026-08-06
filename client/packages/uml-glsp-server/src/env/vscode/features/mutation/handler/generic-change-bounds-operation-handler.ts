/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isSubject, isUseCase } from '@borkdominik-biguml/uml-model-server/grammar';
import { ChangeBoundsOperation, type Command, OperationHandler } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { URI } from 'vscode-uri';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';

type BoundsPatch = { op: 'add'; path: string; value: unknown } | { op: 'replace'; path: string; value: unknown };

@injectable()
export class GenericChangeBoundsOperationHandler extends OperationHandler {
    readonly operationType = ChangeBoundsOperation.KIND;

    declare readonly modelState: DiagramModelState;

    override createCommand(operation: ChangeBoundsOperation): Command {
        return new ModelPatchCommand(this.modelState, this.changeBounds(operation));
    }

    protected changeBounds(operation: ChangeBoundsOperation): string {
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
                    width: newSize?.width,
                    height: newSize?.height
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

            // Only a genuine move - the Subject keeping its current size - should drag its contents
            // along. A resize (even one that also shifts the anchor corner's position, e.g. dragging
            // the top-left handle) must not translate the contents, since the box didn't uniformly
            // translate: it stretched.
            const isResize = newSize && size && (newSize.width !== size.width || newSize.height !== size.height);
            if (newPosition && position && !isResize) {
                const dx = newPosition.x - position.x;
                const dy = newPosition.y - position.y;
                if (dx !== 0 || dy !== 0) {
                    this.cascadeToContainedUseCases(elementId, position, size, dx, dy, nonZeroMovedElementIds, defaultDocPath, patch);
                }
            }
        });

        return JSON.stringify(patch);
    }

    /**
     * Subject and UseCase are flat, independently positioned siblings in the gmodel (visual
     * containment is purely absolute (x,y)/size overlap, not real parent/child nesting - see
     * `diagram-gmodel-factory.tsx`). Moving a Subject therefore does not move the use cases drawn
     * inside its boundary unless we explicitly shift them here by the same delta. Only use cases
     * whose center falls within the Subject's bounds *before* the move are considered contained,
     * and any use case already being genuinely repositioned by this same operation (e.g. multi-
     * selected together with the Subject) is left alone since its own explicit newPosition already
     * applies - cascading on top of that would move it twice.
     */
    protected cascadeToContainedUseCases(
        subjectId: string,
        oldSubjectPosition: { x: number; y: number },
        oldSubjectSize: { width?: number; height?: number } | undefined,
        dx: number,
        dy: number,
        nonZeroMovedElementIds: Set<string>,
        defaultDocPath: string,
        patch: BoundsPatch[]
    ): void {
        const subject = this.modelState.index.findIdElement(subjectId);
        if (!isSubject(subject) || !oldSubjectSize?.width || !oldSubjectSize?.height) {
            return;
        }

        const bounds = {
            left: oldSubjectPosition.x,
            top: oldSubjectPosition.y,
            right: oldSubjectPosition.x + oldSubjectSize.width,
            bottom: oldSubjectPosition.y + oldSubjectSize.height
        };

        for (const entity of this.modelState.semanticRoot.diagram.entities) {
            if (!isUseCase(entity) || nonZeroMovedElementIds.has(entity.__id)) {
                continue;
            }

            const useCasePosition = this.modelState.index.findPosition(entity.__id);
            if (!useCasePosition) {
                continue;
            }
            const useCaseSize = this.modelState.index.findSize(entity.__id);
            const centerX = useCasePosition.x + (useCaseSize?.width ?? 0) / 2;
            const centerY = useCasePosition.y + (useCaseSize?.height ?? 0) / 2;
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
                            __documentUri: useCasePosition.element?.$nodeDescription?.documentUri.path ?? defaultDocPath
                        }
                    },
                    x: useCasePosition.x + dx,
                    y: useCasePosition.y + dy
                }
            });
        }
    }
}
