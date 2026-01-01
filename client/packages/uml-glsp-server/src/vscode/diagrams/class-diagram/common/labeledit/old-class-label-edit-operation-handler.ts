/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { ApplyLabelEditOperation, type Command, OperationHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { isAstNode } from 'langium';
import { BigUmlCommand } from '../../../../biguml/common/handler/big-uml-command.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';

@injectable()
export class ClassLabelEditOperationHandler extends OperationHandler {
    operationType = ApplyLabelEditOperation.KIND;

    @inject(ClassDiagramModelState) protected state: ClassDiagramModelState;

    createCommand(operation: ApplyLabelEditOperation): Command {
        return new BigUmlCommand(this.state, this.editLabel(operation));
    }

    protected editLabel(operation: ApplyLabelEditOperation): string | undefined {
        const labelId = operation.labelId.split('_')[0];
        const node = this.state.index.findSemanticElement(labelId, isAstNode);
        if (!node) {
            return undefined;
        }

        const path = this.state.index.findPath(labelId) + '/' + this.getLabelNameByAstType(node.$type);

        return JSON.stringify([{ op: 'replace', path, value: operation.text }]);
    }

    private getLabelNameByAstType(type: string): string {
        switch (type) {
            case 'Class':
                return 'name';
            case 'Property':
                return 'name';
            case 'Operation':
                return 'name';
            case 'Interface':
                return 'name';
            default:
                return 'name';
        }
    }
}
