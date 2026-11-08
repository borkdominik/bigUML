/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { parseConnectionPointId, parseEdgeCenterId, type RelationType } from '@borkdominik-biguml/uml-glsp-server';
import { admitsEnd } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { EdgeAnchor } from '@borkdominik-biguml/uml-model-server/grammar';
import { type PaletteItem, ToolPaletteItemProvider, TriggerEdgeCreationAction } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { DiagramModelState } from '../model/diagram-model-state.js';

/**
 * Which relations may run between two elements of the loaded diagram.
 *
 * What an edge may run between is what the metamodel says: the types of its `source` and `target`
 * references, rendered into the element metadata (`ElementMetadata.ends`). The grammar links the two
 * references against the same types, so a relation this refuses is one the model could not read back.
 */
@injectable()
export class RelationTypeResolver {
    @inject(DiagramModelState)
    protected readonly modelState: DiagramModelState;

    @inject(ToolPaletteItemProvider)
    protected readonly toolPaletteItemProvider: ToolPaletteItemProvider;

    /**
     * The relations of the loaded diagram that may run from `sourceId` - and to `targetId`, where one is
     * given. None where either end names nothing an edge can end on.
     */
    async relationTypesBetween(sourceId: string, targetId?: string): Promise<RelationType[]> {
        const sourceType = this.endTypeOf(sourceId);
        const targetType = targetId === undefined ? undefined : this.endTypeOf(targetId);
        if (sourceType === undefined || (targetId !== undefined && targetType === undefined)) {
            return [];
        }
        const relationTypes = await this.relationTypes();
        return relationTypes.filter(
            ({ elementTypeId }) =>
                admitsEnd(elementTypeId, 'source', sourceType) &&
                (targetType === undefined || admitsEnd(elementTypeId, 'target', targetType))
        );
    }

    /**
     * The relations of the loaded diagram: the edge entries of its tool palette, so a relation is
     * declared once (its `@toolPalette` decorator) and offered both there and by the "Create relation"
     * tool. Sorted by label, so the picker reads the same whatever section an entry sits in.
     */
    protected async relationTypes(): Promise<RelationType[]> {
        const relationTypes: RelationType[] = [];
        const collect = (items: PaletteItem[]): void => {
            for (const item of items) {
                for (const action of item.actions) {
                    if (TriggerEdgeCreationAction.is(action)) {
                        relationTypes.push({ elementTypeId: action.elementTypeId, label: item.label, icon: item.icon ?? '' });
                    }
                }
                collect(item.children ?? []);
            }
        };
        collect(await this.toolPaletteItemProvider.getItems());
        return relationTypes.sort((a, b) => a.label.localeCompare(b.label));
    }

    /** Whether an edge of `edgeTypeId` may run from `sourceId` to `targetId`. */
    admits(edgeTypeId: string, sourceId: string, targetId: string): boolean {
        const sourceType = this.endTypeOf(sourceId);
        const targetType = this.endTypeOf(targetId);
        return (
            sourceType !== undefined &&
            targetType !== undefined &&
            admitsEnd(edgeTypeId, 'source', sourceType) &&
            admitsEnd(edgeTypeId, 'target', targetType)
        );
    }

    /**
     * The AST type of what an edge drawn to `endId` ends on. The centre dot of an edge stands for that
     * edge's anchor, which the edge is attached to (see `edge-anchor.ts`), and a connection point for the
     * shape it is a point of - an edge runs to the choice, not to one of its tips.
     */
    protected endTypeOf(endId: string): string | undefined {
        const edgeId = parseEdgeCenterId(endId);
        if (edgeId !== undefined) {
            return this.modelState.index.findIdElement(edgeId) ? EdgeAnchor.$type : undefined;
        }
        const ownerId = parseConnectionPointId(endId)?.ownerId ?? endId;
        return this.modelState.index.findIdElement(ownerId)?.$type;
    }
}
