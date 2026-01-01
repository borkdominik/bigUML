/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    type ElementWithSizeAndPosition,
    type Relation,
    isElementWithSizeAndPosition,
    isRelation
} from '@borkdominik-biguml/model-server/grammar';
import { type Command, DeleteElementOperation, OperationHandler } from '@eclipse-glsp/server';
import { BigUmlCommand } from '../../biguml/index.js';
import { type BaseDiagramModelState } from '../model/base-diagram-model-state.js';

type RemoveOp = { op: 'remove'; path: string };

export abstract class AbstractDeleteOperationHandler extends OperationHandler {
    readonly operationType = DeleteElementOperation.KIND;

    abstract override readonly modelState: BaseDiagramModelState;

    override createCommand(operation: DeleteElementOperation): Command | undefined {
        if (!operation.elementIds || operation.elementIds.length === 0) return;
        const patchOps = this.buildDeletePatch(operation);
        if (patchOps.length === 0) return;
        return new BigUmlCommand(this.modelState, JSON.stringify(patchOps));
    }

    protected buildDeletePatch(operation: DeleteElementOperation): RemoveOp[] {
        const removes: RemoveOp[] = [];
        const metaRemoves: RemoveOp[] = [];

        for (const elementId of operation.elementIds) {
            const element = this.modelState.index.findSemanticElement(elementId, isDiagramElement);
            if (!element) continue;

            const semanticId: string = (element as any).__id ?? elementId;

            if (isElementWithSizeAndPosition(element)) {
                const { relationRemoves, relationMetaRemoves } = this.deleteIncidentRelations(semanticId);
                removes.push(...relationRemoves);
                metaRemoves.push(...relationMetaRemoves);

                const extras = this.collectAdditionalRemovesForNode(semanticId);
                removes.push(...extras.removes);
                metaRemoves.push(...extras.metaRemoves);

                const nodePath = this.modelState.index.findPath(semanticId);
                if (nodePath) removes.push({ op: 'remove', path: nodePath });

                metaRemoves.push(...this.deleteSizeAndPosition(semanticId));
            } else if (isRelation(element)) {
                const relPath = this.modelState.index.findPath(semanticId);
                if (relPath) removes.push({ op: 'remove', path: relPath });
                metaRemoves.push(...this.deleteSizeAndPosition(semanticId));
            }
        }

        return sortRemoves<RemoveOp>([...removes, ...metaRemoves]);
    }

    protected deleteIncidentRelations(nodeId: string): {
        relationRemoves: Array<{ op: 'remove'; path: string }>;
        relationMetaRemoves: Array<{ op: 'remove'; path: string }>;
    } {
        const relationRemoves: Array<{ op: 'remove'; path: string }> = [];
        const relationMetaRemoves: Array<{ op: 'remove'; path: string }> = [];

        // Generic access to /diagram/relations
        const diagram: any = (this.modelState.semanticRoot as any)?.diagram;
        const relations: Relation[] = Array.isArray(diagram?.relations) ? (diagram.relations as Relation[]) : [];

        for (const rel of relations) {
            const srcId = (rel as any)?.source?.ref?.__id;
            const trgId = (rel as any)?.target?.ref?.__id;
            if (srcId === nodeId || trgId === nodeId) {
                const relId = (rel as any).__id;
                if (!relId) continue;

                const relPath = this.modelState.index.findPath(relId);
                if (relPath) relationRemoves.push({ op: 'remove', path: relPath });

                // If edges have meta, remove them as well
                const p = this.modelState.index.findPositionPath(relId);
                if (p) relationMetaRemoves.push({ op: 'remove', path: p });
                const s = this.modelState.index.findSizePath(relId);
                if (s) relationMetaRemoves.push({ op: 'remove', path: s });
            }
        }
        return { relationRemoves, relationMetaRemoves };
    }

    /** Hook for diagram-specific cleanup (e.g., remove property-type refs to the node). */

    protected collectAdditionalRemovesForNode(_nodeId: string): {
        removes: Array<{ op: 'remove'; path: string }>;
        metaRemoves: Array<{ op: 'remove'; path: string }>;
    } {
        return { removes: [], metaRemoves: [] };
    }

    protected deleteSizeAndPosition(elementId: string): Array<{ op: 'remove'; path: string }> {
        const ops: Array<{ op: 'remove'; path: string }> = [];
        const p = this.modelState.index.findPositionPath(elementId);
        if (p) ops.push({ op: 'remove', path: p });
        const s = this.modelState.index.findSizePath(elementId);
        if (s) ops.push({ op: 'remove', path: s });
        return ops;
    }
}

function isDiagramElement(item: unknown): item is Relation | ElementWithSizeAndPosition {
    return isRelation(item) || isElementWithSizeAndPosition(item);
}

//sorts relations, nodes, metaInfos etc. to be removed in the correct order
function sortRemoves<T extends RemoveOp>(ops: ReadonlyArray<T>): T[] {
    const bucket = (p: string) =>
        p.startsWith('/diagram/relations') ? 0 : p.startsWith('/diagram/') ? 1 : p.startsWith('/metaInfos') ? 2 : 3;

    return [...ops].sort((a, b) => {
        const ab = bucket(a.path),
            bb = bucket(b.path);
        if (ab !== bb) return ab - bb;

        const ai = pathIndex(a.path);
        const bi = pathIndex(b.path);
        if (ai.parent === bi.parent && ai.idx !== null && bi.idx !== null) {
            return bi.idx - ai.idx;
        }
        return a.path.localeCompare(b.path);
    });
}

function pathIndex(path: string): { parent: string; idx: number | null } {
    const m = path.match(/^(.*)\/(\d+)$/);
    return m ? { parent: m[1], idx: Number(m[2]) } : { parent: path, idx: null };
}
