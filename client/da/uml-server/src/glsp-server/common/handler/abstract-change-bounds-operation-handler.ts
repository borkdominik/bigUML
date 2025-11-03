import { ChangeBoundsOperation, Command, OperationHandler } from '@eclipse-glsp/server';
import { URI } from 'vscode-uri';
import { BigUmlCommand } from '../../biguml/index.js'; // adjust path if needed
import { BaseDiagramModelState } from '../model/base-diagram-model-state.js';

export abstract class AbstractChangeBoundsOperationHandler extends OperationHandler {
    readonly operationType = ChangeBoundsOperation.KIND;

    abstract override readonly modelState: BaseDiagramModelState;

    override createCommand(operation: ChangeBoundsOperation): Command {
        return new BigUmlCommand(this.modelState, this.changeBounds(operation));
    }

    protected changeBounds(operation: ChangeBoundsOperation): string {
        const patch: Array<{ op: 'add'; path: string; value: unknown } | { op: 'replace'; path: string; value: unknown }> = [];

        const defaultDocPath = URI.parse(this.modelState.semanticUri).path;

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
        });

        return JSON.stringify(patch);
    }
}
