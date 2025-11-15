import { ApplyLabelEditOperation, Command, OperationHandler } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { isAstNode } from 'langium';
import { BigUmlCommand } from '../../biguml/common/handler/big-uml-command.js';
import { BaseDiagramModelState } from '../model/base-diagram-model-state.js';

@injectable()
export abstract class AbstractLabelEditOperationHandler extends OperationHandler {
    override operationType = ApplyLabelEditOperation.KIND;

    abstract override readonly modelState: BaseDiagramModelState;

    override createCommand(operation: ApplyLabelEditOperation): Command {
        const patch = this.buildPatch(operation);
        return new BigUmlCommand(this.modelState, patch);
    }

    protected getSemanticIdFromLabelId(labelId: string): string {
        return labelId.split('_')[0];
    }

    // override if some types use a different field
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected getLabelPropertyName(_astNode: unknown): string {
        return 'name';
    }

    protected buildPatch(operation: ApplyLabelEditOperation): string {
        const semanticId = this.getSemanticIdFromLabelId(operation.labelId);
        const node = this.modelState.index.findSemanticElement(semanticId, isAstNode);
        if (!node) {
            return JSON.stringify([]);
        }
        const prop = this.getLabelPropertyName(node);
        const path = this.modelState.index.findPath(semanticId) + '/' + prop;

        return JSON.stringify([
            {
                op: 'replace' as const,
                path,
                value: operation.text
            }
        ]);
    }
}
