/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
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
import { createRandomUUID, findAvailableNodeName } from '@borkdominik-biguml/model-server';
import {
    type Command,
    CreateNodeOperation,
    type CreateNodeOperationHandler,
    OperationHandler,
    type Point,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { URI } from 'vscode-uri';
import { BigUmlCommand } from '../../../../biguml/index.js';
import { GridSnapper } from '../../../../common/handler/grid-snapper.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';

@injectable()
export class CreateClassOperationHandler extends OperationHandler implements CreateNodeOperationHandler {
    readonly operationType = CreateNodeOperation.KIND;
    override label = 'Class';

    elementTypeIds = [ModelTypes.CLASS];

    @inject(PackageDiagramModelState)
    declare modelState: PackageDiagramModelState;

    override createCommand(operation: CreateNodeOperation): Command {
        const modelPatch = this.createClass(operation);
        const modelDetailsPatch = this.createNodeDetails(
            operation,
            JSON.parse(modelPatch).value.__id,
            URI.parse(this.modelState.semanticUri).path
        );
        const patch = [JSON.parse(modelPatch), ...JSON.parse(modelDetailsPatch)];
        return new BigUmlCommand(this.modelState, JSON.stringify(patch));
    }

    createNodeDetails(operation: CreateNodeOperation, id: string, nodeDocumentUri: string): string {
        const position = this.getRelativeLocation(operation);
        const location = this.getLocation(operation);
        const patch: any[] = [];
        patch.push({
            op: 'add',
            path: '/metaInfos/-',
            value: {
                $type: 'Size',
                __id: 'size_' + id,
                element: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
                width: 80,
                height: 30
            }
        });
        patch.push({
            op: 'add',
            path: '/metaInfos/-',
            value: {
                $type: 'Position',
                element: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
                __id: 'pos_' + id,
                x: position?.x ?? location?.x ?? 0,
                y: position?.y ?? location?.y ?? 0
            }
        });
        return JSON.stringify(patch);
    }

    getTriggerActions(): TriggerNodeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerNodeCreationAction.create(typeId));
    }

    getLocation(operation: CreateNodeOperation): Point | undefined {
        return GridSnapper.snap(operation.location);
    }

    getContainerPath(operation: CreateNodeOperation): string | undefined {
        if (operation.containerId) {
            return this.modelState.index.findPath(operation.containerId) + '/entities/-';
        }
        return undefined;
    }

    createClass(operation: CreateNodeOperation): string {
        const containerPath = this.getContainerPath(operation) ?? '';
        const newName = findAvailableNodeName(this.modelState.semanticRoot, 'NewClass');
        const patch = JSON.stringify({
            op: 'add',
            path: containerPath ?? '/diagram/entities/-',
            value: {
                $type: 'Class',
                __id: createRandomUUID(),
                name: newName,
                visibility: 'PUBLIC',
                isAbstract: false,
                isActive: true
            }
        });
        return patch;
    }

    getRelativeLocation(operation: CreateNodeOperation) {
        const categoryPosition = this.modelState.index.findPosition(operation.containerId!);
        if (!operation.location || !categoryPosition) {
            return undefined;
        }
        return {
            x: operation.location?.x - categoryPosition?.x,
            y: operation.location?.y - categoryPosition?.y
        };
    }
}
