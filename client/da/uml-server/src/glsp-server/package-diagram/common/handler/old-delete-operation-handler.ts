/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { Command, DeleteElementOperation, OperationHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import {
    ElementWithSizeAndPosition,
    Relation,
    isElementWithSizeAndPosition,
    isRelation
} from '../../../../language-server/generated/ast.js';
import { BigUmlCommand } from '../../../biguml/common/handler/big-uml-command.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export class PackageDiagramDeleteOperationHandler extends OperationHandler {
    operationType = DeleteElementOperation.KIND;

    @inject(PackageDiagramModelState) protected state: PackageDiagramModelState;

    createCommand(operation: DeleteElementOperation): Command | undefined {
        if (!operation.elementIds || operation.elementIds.length === 0) {
            return;
        }
        const patch = this.deleteElements(operation);
        return new BigUmlCommand(this.state, JSON.stringify(patch));
    }

    protected deleteElements(operation: DeleteElementOperation) {
        const patch: any[] = [];
        const patchDetails: any[] = [];
        for (const elementId of operation.elementIds) {
            const element = this.state.index.findSemanticElement(elementId, isDiagramElement);
            const path = this.state.index.findPath(elementId);
            patch.push({
                op: 'remove',
                path
            });
            if (isElementWithSizeAndPosition(element)) {
                // patch = [...this.deleteIncomingAndOutgoingEdges(elementId), ...patch];
                patchDetails.push(...this.deleteSizeAndPosition(elementId));
            }
        }
        patch.sort(patchPrioritySorter);
        patchDetails.sort(patchPrioritySorter);
        return [...patch, ...patchDetails];
    }

    // private deleteIncomingAndOutgoingEdges(nodeId: string): any[] {
    //   const edgesToRemove = this.state.semanticRoot.edges.filter(
    //     (edge) =>
    //       edge.source?.ref?.__id === nodeId || edge.target?.ref?.__id === nodeId
    //   );
    //   return edgesToRemove.map((edge) => ({
    //     op: "remove",
    //     path: this.state.index.findPath(edge.__id),
    //   }));
    // }

    private deleteSizeAndPosition(nodeId: string): any[] {
        return [
            {
                op: 'remove',
                path: this.state.index.findPositionPath(nodeId)
            },
            {
                op: 'remove',
                path: this.state.index.findSizePath(nodeId)
            }
        ];
    }
}

function isDiagramElement(item: unknown): item is Relation | ElementWithSizeAndPosition {
    return isRelation(item) || isElementWithSizeAndPosition(item);
}
function patchPrioritySorter(a, b) {
    if (a.path.length === 0 || b.path.length === 0) {
        return b.path.localeCompare(a.path);
    }
    const aPath = a.path.split('/');
    const bPath = b.path.split('/');
    let i = 0;
    while (aPath[i] === bPath[i]) {
        i += 1;
    }
    if (!isNaN(aPath[i]) && !isNaN(bPath[i])) {
        const compare = +bPath[i] - +aPath[i];
        return compare !== 0
            ? compare
            : patchPrioritySorter(
                  {
                      ...a,
                      path: aPath.slice(aPath.indexOf(aPath[i]) + aPath[i].length)
                  },
                  { ...b, path: bPath.slice(bPath.indexOf(bPath[i]) + bPath[i].length) }
              );
    }
    return b.path.localeCompare(a.path);
}
